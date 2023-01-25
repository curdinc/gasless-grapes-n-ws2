import { env } from "@env/server.mjs";
import type { TransactionRequest } from "@ethersproject/abstract-provider";
import { Links } from "@utils/links";
import { ErrorMessages } from "@utils/messages";
import { makeId } from "@utils/randomId";
import { Relayer } from "defender-relay-client";
import type { BigNumber } from "ethers";
import { ethers } from "ethers";
import type { SupportedChainType } from "types/schema/blockchain/chains";

export async function getSmartContractWalletAddress({
  eoaWalletAddress,
}: {
  eoaWalletAddress: string;
}) {
  const provider = ethers.getDefaultProvider(Links.rpcUrl({ chain: "Goerli" }));
  const walletAddressInterface = new ethers.utils.Interface([
    "function calcWalletAddress(bytes32 _salt, address _EOA) external view returns(address)",
  ]);
  const salt = ethers.utils.formatBytes32String(makeId(31));
  const result = await provider.call({
    to: env.SCW_WALLET_FACTORY,
    data: walletAddressInterface.encodeFunctionData("calcWalletAddress", [
      salt,
      eoaWalletAddress,
    ]),
  });
  const value = walletAddressInterface.decodeFunctionResult(
    "calcWalletAddress",
    result
  )[0];
  return { salt, walletAddress: value };
}

const OPEN_ZEPPELIN_API_KEY: Record<
  SupportedChainType,
  { apiKey: string; apiSecret: string }
> = {
  Ethereum: { apiKey: "", apiSecret: "" },
  Goerli: {
    apiKey: env.OPEN_ZEPPELIN_API_KEY,
    apiSecret: env.OPEN_ZEPPELIN_SECRET_KEY,
  },
  Polygon: { apiKey: "", apiSecret: "" },
  Mumbai: { apiKey: "", apiSecret: "" },
};

export async function deploySmartContractWallet(
  salt: string,
  chain: SupportedChainType,
  ownerAddress: string
) {
  const credentials = OPEN_ZEPPELIN_API_KEY[chain];
  const relayer = new Relayer(credentials);

  const walletFactoryInterface = new ethers.utils.Interface([
    "function createWallet(bytes32 _salt, address _EOA) external returns(address)",
  ]);
  const transactionData = walletFactoryInterface.encodeFunctionData(
    "createWallet",
    [salt, ownerAddress]
  );
  const tx = await relayer.sendTransaction({
    to: env.SCW_WALLET_FACTORY,
    data: transactionData,
    speed: "fast",
    gasLimit: 1_000_000,
  });
  return { openZeppelinTransactionId: tx.transactionId, txHash: tx.hash };
}

export async function sendOneTransaction({
  nonce,
  chain,
  signature,
  transaction,
}: {
  nonce: BigNumber;
  transaction: TransactionRequest;
  signature: string;
  chain: SupportedChainType;
}) {
  const credentials = OPEN_ZEPPELIN_API_KEY[chain];
  const relayer = new Relayer(credentials);

  const walletFactoryInterface = new ethers.utils.Interface([
    "function execute(tuple(uint256 gasLimit, address target, uint256 value, bytes data) calldata transaction, uint256 nonce, bytes memory signature) external ",
  ]);

  if (!transaction.data) {
    throw new Error(ErrorMessages.invalidTransactionRequest);
  }

  const transactionData = walletFactoryInterface.encodeFunctionData("execute", [
    [
      transaction.gasLimit ?? 0,
      transaction.to,
      transaction.value ?? 0,
      transaction.data ?? "0x",
    ],
    nonce,
    signature,
  ]);

  const tx = await relayer.sendTransaction({
    to: transaction.from,
    data: transactionData,
    speed: "fast",
    gasLimit: 10_000_000,
  });
  return { openZeppelinTransactionId: tx.transactionId, txHash: tx.hash };
}

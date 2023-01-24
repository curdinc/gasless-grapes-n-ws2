import { env } from "@env/server.mjs";
import { Links } from "@utils/links";
import { makeId } from "@utils/randomId";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";
import { ethers } from "ethers";
import type { SupportedChainType } from "types/schema/blockchain/chains";

export async function getSmartContractWalletAddress() {
  const provider = ethers.getDefaultProvider(Links.rpcUrl({ chain: "Goerli" }));
  const walletAddressInterface = new ethers.utils.Interface([
    "function calcWalletAddress(bytes32 _salt) external view returns(address)",
  ]);
  const salt = ethers.utils.formatBytes32String(makeId(31));
  const result = await provider.call({
    to: env.SCW_WALLET_FACTORY,
    data: walletAddressInterface.encodeFunctionData("calcWalletAddress", [
      salt,
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
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const walletFactoryInterface = new ethers.utils.Interface([
    "function createWallet(bytes32 _salt, address _EOA) external returns(address)",
  ]);
  const transactionData = walletFactoryInterface.encodeFunctionData(
    "createWallet",
    [salt, ownerAddress]
  );
  const tx = await signer.sendTransaction({
    to: env.SCW_WALLET_FACTORY,
    data: transactionData,
  });
  const mined = await tx.wait();
  return { txHash: mined.transactionHash };
}

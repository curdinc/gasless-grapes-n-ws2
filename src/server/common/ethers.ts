import { env } from "@env/server.mjs";
import { Links } from "@utils/links";
import { makeId } from "@utils/randomId";
import console from "console";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";
import { ethers } from "ethers";

export async function getSmartContractWalletAddress() {
  console.log(
    'Links.rpcUrl({ chain: "Goerli" })',
    Links.rpcUrl({ chain: "Goerli" })
  );
  const provider = ethers.getDefaultProvider(Links.rpcUrl({ chain: "Goerli" }));
  const walletAddressInterface = new ethers.utils.Interface([
    "function calcWalletAddress(bytes32 _salt) external view returns(address)",
  ]);
  const salt = ethers.utils.formatBytes32String(makeId(31));
  console.log("env.SCW_WALLET_FACTORY", env.SCW_WALLET_FACTORY);
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

export async function deploySmartContractWallet(salt: string) {
  const credentials = {
    apiKey: env.OPEN_ZEPPELIN_API_KEY,
    apiSecret: env.OPEN_ZEPPELIN_SECRET_KEY,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const walletFactoryInterface = new ethers.utils.Interface([
    "function createWallet(bytes32 _salt) external returns(address)",
  ]);
  const transactionData = walletFactoryInterface.encodeFunctionData(
    "createWallet",
    [salt]
  );
  const tx = await signer.sendTransaction({
    to: env.SCW_WALLET_FACTORY,
    data: transactionData,
  });
  const mined = await tx.wait();
  return { txHash: mined.transactionHash };
}

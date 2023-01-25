import type { BigNumber } from "ethers";
import { ethers } from "ethers";
import type { SupportedChainType } from "types/schema/blockchain/chains";
import { ErrorMessages } from "./messages";

export class Blockchain {
  static formatEvmAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  static getSmartContractParamToSign(
    nonce: BigNumber,
    gasLimit: BigNumber,
    target: string,
    value: BigNumber,
    data: string
  ) {
    const encodedParams = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256", "address", "uint256", "bytes"],
      [nonce, gasLimit, target, value, data]
    );
    const hash = ethers.utils.keccak256(encodedParams);
    return ethers.utils.arrayify(hash);
  }

  static chainNameToId(chainName: SupportedChainType) {
    switch (chainName) {
      case "Ethereum":
        return 1;
      case "Goerli":
        return 5;
      case "Mumbai":
        return 80001;
      case "Polygon":
        return 137;
    }
  }
  static chainIdToName(chainId: number): SupportedChainType {
    switch (chainId) {
      case 1:
        return "Ethereum";
      case 5:
        return "Goerli";
      case 137:
        return "Polygon";
      case 80001:
        return "Mumbai";
      default:
        throw new Error(ErrorMessages.unknownChainId);
    }
  }
}

import { env } from "@env/client.mjs";
import type {
  AlchemyChainType,
  SupportedChainType,
  TenderlyChainType,
} from "types/schema/blockchain/chains";

export class Links {
  static tenderlyRpcUrl = (chain: TenderlyChainType) => {
    switch (chain) {
      case "Ethereum":
        return `https://mainnet.gateway.tenderly.co/${env.NEXT_PUBLIC_TENDERLY_API_KEY}`;
      case "Goerli":
        return `https://goerli.gateway.tenderly.co/${env.NEXT_PUBLIC_TENDERLY_API_KEY}`;
    }
  };

  static alchemyRpcUrl = (chain: AlchemyChainType) => {
    switch (chain) {
      case "Polygon":
        return `https://polygon-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY}`;
      case "Mumbai":
        return `https://polygon-mumbai.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY}`;
      case "Ethereum":
        return `https://eth-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY}`;
      case "Goerli":
        return `https://eth-goerli.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY}`;
    }
  };

  static rpcUrl(chain: SupportedChainType) {
    switch (chain) {
      case "Ethereum":
      case "Goerli":
      case "Polygon":
      case "Mumbai":
        return Links.alchemyRpcUrl(chain);
    }
  }
}

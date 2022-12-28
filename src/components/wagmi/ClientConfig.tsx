import { CoinbaseWalletConnector } from "@wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "@wagmi/connectors/injected";
import { MetaMaskConnector } from "@wagmi/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/connectors/walletConnect";
import React from "react";
import { configureChains, createClient, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

export const WagmiClientConfig = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
    // [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()],
  );

  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "Gasless Grapes",
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: (detectedName) =>
            `${
              typeof detectedName === "string" ? detectedName : detectedName[0]
            }`,
          shimDisconnect: true,
          shimChainChangedDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  });

  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

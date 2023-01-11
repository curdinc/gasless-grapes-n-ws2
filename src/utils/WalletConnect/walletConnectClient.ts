import { env } from "@env/client.mjs";
import SignClient from "@walletconnect/sign-client";
import type { SessionTypes } from "@walletconnect/types";
import { log } from "next-axiom";

export let WalletConnectClient: SignClient;

export async function createSignClient(relayerRegionURL?: string) {
  if (!WalletConnectClient) {
    WalletConnectClient = await SignClient.init({
      logger: "debug",
      projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      relayUrl: env.NEXT_PUBLIC_WALLET_CONNECT_RELAY_URL,
      metadata: {
        name: "Gasless Grapes",
        description: "WalletConnect for Gasless Grapes",
        url: "https://gaslessgrapes.com/",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      },
    });

    // TODOs
    WalletConnectClient.on("session_proposal", async (proposal) => {
      const { id, params } = proposal;
      const { requiredNamespaces, relays } = params;

      const namespaces: SessionTypes.Namespaces = {};
      Object.keys(requiredNamespaces).forEach((ecosystem) => {
        const accounts: string[] = [];
        requiredNamespaces[ecosystem]?.chains.map((chain) => {
          ["0xb3E9C57fB983491416a0C77b07629C0991c3FD59"].map((acc) =>
            accounts.push(`${chain}:${acc}`)
          );
        });
        namespaces[ecosystem] = {
          accounts,
          methods: requiredNamespaces[ecosystem]?.methods ?? [],
          events: requiredNamespaces[ecosystem]?.events ?? [],
        };
      });

      const { acknowledged } = await WalletConnectClient.approve({
        id,
        relayProtocol: relays[0]?.protocol,
        namespaces,
      });
      const session = await acknowledged();
      console.log("session", session);
    });
    WalletConnectClient.on("session_request", (data) =>
      log.info("session_request", data)
    );
    WalletConnectClient.on("session_ping", (data) => console.log("ping", data));
    WalletConnectClient.on("session_event", (data) =>
      console.log("event", data)
    );
    WalletConnectClient.on("session_update", (data) =>
      console.log("update", data)
    );
    WalletConnectClient.on("session_delete", (data) =>
      console.log("delete", data)
    );
  }
}

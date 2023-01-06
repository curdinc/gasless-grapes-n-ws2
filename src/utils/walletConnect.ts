import { env } from "@env/client.mjs";
import SignClient from "@walletconnect/sign-client";

export let signClient: SignClient;

export async function createSignClient(relayerRegionURL?: string) {
  signClient = await SignClient.init({
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
  signClient.on("session_proposal", (data) =>
    console.log("session_proposal", data)
  );
  signClient.on("session_request", (data) =>
    console.log("session_request", data)
  );
  signClient.on("session_ping", (data) => console.log("ping", data));
  signClient.on("session_event", (data) => console.log("event", data));
  signClient.on("session_update", (data) => console.log("update", data));
  signClient.on("session_delete", (data) => console.log("delete", data));
}

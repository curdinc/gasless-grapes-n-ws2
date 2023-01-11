import type { WalletConnectLegacySessionRequestProps } from "@components/pages/wallet/wallet-connect/legacy/WalletConnectLegacySessionRequest";
import { WalletConnectLegacySessionRequest } from "@components/pages/wallet/wallet-connect/legacy/WalletConnectLegacySessionRequest";
import { WalletConnectLegacySignMessage } from "@components/pages/wallet/wallet-connect/legacy/WalletConnectLegacySignMessage";
import LegacySignClient from "@walletconnect/client";
import type { IWalletConnectSession } from "@walletconnect/legacy-types";
import { walletConnectStore } from "hooks/stores/useWalletConnectStore";
import { log } from "next-axiom";
import { EIP155_SIGNING_METHODS } from "./methods";

export let walletConnectLegacySignClient: LegacySignClient;

export function createLegacySignClient({ uri }: { uri?: string }) {
  // If URI is passed always create a new session,
  // otherwise fall back to cached session if client isn't already instantiated.
  if (uri) {
    deleteCachedLegacySession();
    walletConnectLegacySignClient = new LegacySignClient({ uri });
  } else if (!walletConnectLegacySignClient && getCachedLegacySession()) {
    const session = getCachedLegacySession();
    walletConnectLegacySignClient = new LegacySignClient({ session });
  } else {
    return;
  }

  const { openModal } = walletConnectStore.getState();
  walletConnectLegacySignClient.on(
    "session_request",
    (error, payload: WalletConnectLegacySessionRequestProps) => {
      if (error) {
        log.error(`legacySignClient > session_request failed: ${error}`);
        throw new Error(`legacySignClient > session_request failed: ${error}`);
      }
      if (!payload) {
        log.error("legacySignClient > session_request missing payload");
        throw new Error("legacySignClient > session_request missing payload");
      }

      openModal({
        modalTitle: "Session Connection",
        modalBody: WalletConnectLegacySessionRequest(payload),
      });
    }
  );

  walletConnectLegacySignClient.on(
    "connect",
    (
      error,
      payload: {
        event: "connect";
        params: WalletConnectLegacySessionRequestProps["params"];
      }
    ) => {
      // fired after the user approves the session_request
      console.log("legacySignClient > connect");
    }
  );

  walletConnectLegacySignClient.on("error", (error) => {
    throw new Error(`legacySignClient > on error: ${error}`);
  });

  walletConnectLegacySignClient.on("call_request", (error, payload) => {
    if (error) {
      throw new Error(`legacySignClient > call_request failed: ${error}`);
    }
    onCallRequest(payload);
  });

  walletConnectLegacySignClient.on("disconnect", async () => {
    deleteCachedLegacySession();
  });
}

const onCallRequest = async (payload: {
  id: number;
  method: string;
  params: unknown[];
}) => {
  const { openModal } = walletConnectStore.getState();
  if (!walletConnectLegacySignClient.session.peerMeta) {
    throw new Error("Missing connecting app details");
  }

  switch (payload.method) {
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      return openModal({
        modalTitle: "Sign Message",
        modalBody: WalletConnectLegacySignMessage({
          projectDetails: walletConnectLegacySignClient.session.peerMeta,
          transactionDetails: payload,
        }),
      });

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
    // openModal("LegacySessionSignTypedDataModal", {
    //   legacyCallRequestEvent: payload,
    //   legacyRequestSession: walletConnectLegacySignClient.session,
    // });

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
    // openModal({
    //   modalTitle: "Sign Transaction",
    // });

    default:
      alert(`${payload.method} is not supported for WalletConnect v1`);
  }
};

function getCachedLegacySession(): IWalletConnectSession | undefined {
  if (typeof window === "undefined") return;

  const local = window.localStorage
    ? window.localStorage.getItem("walletconnect")
    : null;

  let session = null;
  if (local) {
    try {
      session = JSON.parse(local);
    } catch (error) {
      throw error;
    }
  }
  return session;
}

export function deleteCachedLegacySession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("walletconnect");
}

import type { TransactionRequest } from "@ethersproject/abstract-provider";
import type { AutotaskEvent } from "defender-autotask-utils";
import {
  DefenderRelayProvider,
  DefenderRelaySigner,
} from "defender-relay-client/lib/ethers";

// Entrypoint for the Autotask
export async function handler(event: AutotaskEvent) {
  const { transaction } = event.request?.body as {
    transaction: TransactionRequest;
  };
  const { credentials, relayerARN } = event;
  // Initialize defender relayer provider and signer
  if (!credentials || !relayerARN) {
    return { error: "Missing relayer credentials" };
  }
  const provider = new DefenderRelayProvider({ credentials, relayerARN });
  const signer = new DefenderRelaySigner(
    { credentials, relayerARN },
    provider,
    { speed: "fast" }
  );
  try {
    const response = await signer.sendTransaction(transaction);
    return { txHash: response.hash };
  } catch (e) {
    return { error: JSON.stringify(e, null, 2) };
  }
}

// Sample typescript type definitions
type EnvInfo = {
  API_KEY: string;
  API_SECRET: string;
};

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  import("dotenv").then((dotenv) => {
    dotenv.config();
    if (
      !process.env.OPEN_ZEPPELIN_API_KEY ||
      !process.env.OPEN_ZEPPELIN_SECRET_KEY
    ) {
      throw new Error("Missing API keys");
    }
    handler({
      apiKey: process.env.OPEN_ZEPPELIN_API_KEY,
      apiSecret: process.env.OPEN_ZEPPELIN_SECRET_KEY,
    })
      .then(() => process.exit(0))
      .catch((error: Error) => {
        console.error(error);
        process.exit(1);
      });
  });
}

import { Button } from "@components/input/Button";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import type { RegistrationCredentialJSON } from "@simplewebauthn/typescript-types";
import { trpc } from "@utils/trpc";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const { data, refetch } = trpc.webAuthn.getAuthenticationOptions.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate } = trpc.webAuthn.verifyAuthentication.useMutation({
    onError(error, variables, context) {
      console.error("auth error", error);
      console.log("variables", variables);
      console.log("context", context);
    },
    onSuccess(data, variables, context) {
      setAuthenticated(true);
      console.log("auth data", data);
      console.log("variables", variables);
      console.log("context", context);
    },
  });
  console.log("data", data);

  const authenticate = async () => {
    if (!data) {
      return;
    }
    let assertionResponse;
    try {
      assertionResponse = await startAuthentication(data);
    } catch (e) {
      return console.error(e);
    }
    mutate(assertionResponse);
  };
  const [refetched, setRefetched] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    console.log(
      'Buffer.from("cJ6i6k_D8WI8sBWrY6iKMhONoyKUn2e9nwfoBFROB2o", "base64url").toString("hex")',
      Buffer.from(
        "cJ6i6k_D8WI8sBWrY6iKMhONoyKUn2e9nwfoBFROB2o",
        "base64"
      ).toString("hex")
    );
  }, []);

  return (
    <div>
      <RegisterButton />
      {!refetched ? (
        <Button
          onClick={() => {
            setRefetched(true);
            refetch();
          }}
          className="btn"
        >
          Get auth options
        </Button>
      ) : (
        <div>Try auth now</div>
      )}
      {!authenticated ? (
        <Button onClick={authenticate} className="btn">
          auth
        </Button>
      ) : (
        <div>succeess!</div>
      )}
    </div>
  );
}

export function RegisterButton() {
  const { data } = trpc.webAuthn.getRegistrationOptions.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate } = trpc.webAuthn.verifyRegistration.useMutation({
    onError(error, variables, context) {
      console.error("registration error", error);
      console.log("variables", variables);
      console.log("context", context);
    },
    onSuccess(data, variables, context) {
      setRegistered(true);
      console.log("registration data", data);
      console.log("variables", variables);
      console.log("context", context);
    },
  });
  const [registered, setRegistered] = useState(false);

  const register = async () => {
    if (!data) {
      return;
    }
    let attestationResponse: RegistrationCredentialJSON;
    try {
      attestationResponse = await startRegistration(data);
    } catch (e) {
      return console.error(e);
    }
    mutate(attestationResponse);
  };
  if (registered) {
    return <div>registered</div>;
  }

  return (
    <Button onClick={register} className="btn" disabled={!data}>
      {!data ? "Loading..." : "Register"}
    </Button>
  );
}

import { Button } from "@components/input/Button";
import { startAuthentication } from "@simplewebauthn/browser";
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
  return <Button>hi</Button>;
}

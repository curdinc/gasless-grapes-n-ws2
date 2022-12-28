import { Button } from "@components/input/Button";
import { startAuthentication } from "@simplewebauthn/browser";
import type { AuthenticationCredentialJSON } from "@simplewebauthn/typescript-types";
import { ErrorMessages } from "@utils/messages";
import { Routes } from "@utils/routes";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const redirectUrl = router.query[Routes.authRedirectQueryParam];

  const { data: authenticationOptions } =
    trpc.webAuthn.getAuthenticationOptions.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { mutate: verifyAuthentication } =
    trpc.webAuthn.verifyAuthentication.useMutation({
      onError(error) {
        console.error("auth error", error);
      },
      onSuccess() {
        if (typeof redirectUrl === "string") {
          router.push(redirectUrl);
          return;
        }
        router.push(Routes.home);
      },
    });
  const [error, setError] = useState("");

  const authenticate = async () => {
    if (!authenticationOptions) {
      return;
    }
    let assertionResponse: AuthenticationCredentialJSON;
    try {
      assertionResponse = await startAuthentication(authenticationOptions);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        if (e.message.includes(ErrorMessages.webAuthnTimeOutOrCancel)) {
          setError(ErrorMessages.userDeclinedRegistrationOrTimeout);
        } else {
          setError(e.message);
        }
      } else {
        setError(ErrorMessages.somethingWentWrong);
      }
      return;
    }
    verifyAuthentication(assertionResponse);
  };

  return (
    <div className={"flex flex-1 items-center justify-center"}>
      <div className="flex max-w-md flex-col  rounded-xl  p-14">
        <h1 className="">Sign In </h1>
        <p className="pt-1 text-sm text-neutral-400">
          Verify your device to continue
        </p>
        <Button className="btn mt-5 w-full" onClick={authenticate}>
          Sign In
        </Button>
        {error && <p className="pt-2 text-sm text-danger-400">{error}</p>}
        <p className="pt-2 text-sm text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link className="link" href={Routes.signUp}>
            Create a new account
          </Link>
        </p>
      </div>
    </div>
  );
}

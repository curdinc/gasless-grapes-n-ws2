import { BaseLayout } from "@components/layout/BaseLayout";
import { Button } from "@components/ui/input/Button";
import { startAuthentication } from "@simplewebauthn/browser";
import type {
  AuthenticationCredentialJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/typescript-types";
import { ErrorMessages } from "@utils/messages";
import { Routes } from "@utils/routes";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useState } from "react";

const redirectUser = (redirectUrl: unknown, verified: boolean) => {
  if (typeof redirectUrl === "string") {
    router.push(redirectUrl);
  } else if (verified) {
    router.push(Routes.wallet.home);
  } else if (!verified) {
    router.push(Routes.home);
  }
};

export default function SignIn() {
  const router = useRouter();
  const redirectUrl = router.query[Routes.authRedirectQueryParam];
  const utils = trpc.useContext();

  const { mutate: verifyAuthentication } =
    trpc.webAuthn.verifyAuthentication.useMutation({
      onError(error) {
        console.log("error.data", error.data);
        console.log("error", error.shape);
        setError(error.message);
      },
      onSuccess({ verified }) {
        redirectUser(redirectUrl, verified);
      },
    });
  const [error, setError] = useState("");

  const authenticate = async () => {
    let authenticationOptions: PublicKeyCredentialRequestOptionsJSON;
    try {
      authenticationOptions =
        await utils.webAuthn.getAuthenticationOptions.fetch();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      return;
    }

    let assertionResponse: AuthenticationCredentialJSON;
    try {
      assertionResponse = await startAuthentication(authenticationOptions);
    } catch (e) {
      let errorMessage = ErrorMessages.somethingWentWrong;
      if (e instanceof Error) {
        if (e.message.includes(ErrorMessages.WebAuthn.timeoutOrCancel)) {
          errorMessage = ErrorMessages.userDeclinedRegistrationOrTimeout;
        } else {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      return;
    }
    verifyAuthentication(assertionResponse);
  };

  return (
    <div className={"flex-1 items-center justify-center"}>
      <div className="max-w-md flex-col  rounded-xl  p-14">
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

SignIn.getLayout = function getLayout(page: React.ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

import { Button } from "@components/ui/input/Button";
import { env } from "@env/client.mjs";
import { startRegistration } from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationCredentialJSON,
} from "@simplewebauthn/typescript-types";
import { ClientEncryption } from "@utils/clientEncryption";
import { ErrorMessages } from "@utils/messages";
import { Routes } from "@utils/routes";
import { trpc } from "@utils/trpc";
import { WebAuthnUtils } from "@utils/webAuthn";
import { Wallet } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ErrorCallbackType } from "types/functionCallback";

export const RegisterDeviceButton = <T extends true | false>(
  props: T extends true
    ? {
        isRegisteringNewUser: T;
        onNewUserError: ErrorCallbackType;
      }
    : { isRegisteringNewUser: T }
) => {
  const [error, setError] = useState("");

  const router = useRouter();
  const redirectUrl = router.query[Routes.authRedirectQueryParam];

  const utils = trpc.useContext();

  const { mutateAsync: verifyDeviceRegistration } =
    trpc.webAuthn.verifyRegistration.useMutation({
      onSuccess() {
        utils.user.me.refetch();
      },
    });

  const registerDevice = async () => {
    let registrationOptions: PublicKeyCredentialCreationOptionsJSON;
    try {
      registrationOptions = await utils.webAuthn.getRegistrationOptions.fetch();
    } catch (e) {
      console.error("Error Fetching registration options", e);
      setError(ErrorMessages.somethingWentWrong);
      return;
    }

    let attestationResponse: RegistrationCredentialJSON;
    try {
      if (props.isRegisteringNewUser) {
        const canRegisterNewUser = await utils.user.canRegisterNewUser.fetch();
        if (!canRegisterNewUser) {
          props.onNewUserError({
            error: new Error(ErrorMessages.userTookTooLong),
          });
        }
      }
      attestationResponse = await startRegistration(registrationOptions);
    } catch (e) {
      console.error("Error getting user credentials:", e);
      setError(ErrorMessages.userDeclinedRegistrationOrTimeout);
      return;
    }

    try {
      const wallet = Wallet.createRandom();
      const verificationResult = await verifyDeviceRegistration({
        ...attestationResponse,
        eoaAddress: wallet.address,
        eoaEncryptedPrivateKey: await new ClientEncryption({
          pwd: env.NEXT_PUBLIC_EOA_ENCRYPTION_KEY,
        }).encrypt(wallet.privateKey),
      });

      WebAuthnUtils.redirectUser(redirectUrl, verificationResult.verified);
    } catch (e) {
      console.error("Error verifying device credentials", e);
      setError(ErrorMessages.somethingWentWrong);
      return;
    }
  };

  return (
    <>
      <Button className="btn w-full" onClick={registerDevice}>
        Register Device
      </Button>
      {error && <p className="pt-2 text-sm text-danger-400">{error}</p>}
    </>
  );
};

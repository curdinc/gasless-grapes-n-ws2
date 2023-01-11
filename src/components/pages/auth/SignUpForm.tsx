import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationCredentialJSON,
} from "@simplewebauthn/typescript-types";
import { ErrorMessages } from "@utils/messages";
import { Routes } from "@utils/routes";
import { trpc } from "@utils/trpc";
import {
  Form,
  FormDescription,
  FormError,
  FormInput,
  FormLabel,
  FormSubmit,
  useFormState,
} from "ariakit/form";
import router, { useRouter } from "next/router";

const redirectUser = (redirectUrl: unknown, verified: boolean) => {
  if (typeof redirectUrl === "string") {
    router.push(redirectUrl);
  } else if (verified) {
    router.push(Routes.wallet.home);
  } else if (!verified) {
    router.push(Routes.home);
  }
};
export const SignUpForm = () => {
  const router = useRouter();
  const redirectUrl = router.query[Routes.authRedirectQueryParam];
  const { mutate: authenticateDevice } =
    trpc.webAuthn.verifyAuthentication.useMutation({
      onError(data) {
        console.error(data);
      },
      onSuccess(verificationResult) {
        redirectUser(redirectUrl, verificationResult.verified);
      },
    });
  const { mutateAsync: verifyDeviceRegistration } =
    trpc.webAuthn.verifyRegistration.useMutation({
      onSuccess(verificationResult) {
        redirectUser(redirectUrl, verificationResult.verified);
      },
    });
  const form = useFormState({
    defaultValues: { deviceName: "", email: "", genericError: "" },
  });
  const utils = trpc.useContext();
  trpc.webAuthn.getAuthenticationOptions.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    async onSuccess(authOptions) {
      const isAutoFillAvailable = await browserSupportsWebAuthn();
      console.log("isAutoFillAvailable", isAutoFillAvailable);
      if (isAutoFillAvailable) {
        try {
          console.log("started authentication");
          const attestationResponse = await startAuthentication(
            authOptions,
            true
          );
          authenticateDevice(attestationResponse);
        } catch (e) {
          console.error("Error authenticating user on sign-up", e);
        }
      }
    },
  });

  form.useSubmit(async () => {
    let registrationOptions: PublicKeyCredentialCreationOptionsJSON;
    try {
      registrationOptions = await utils.webAuthn.getRegistrationOptions.fetch();
    } catch (e) {
      console.error("Error Fetching registration options", e);
      form.setErrors({
        genericError: ErrorMessages.somethingWentWrong,
      });
      throw e;
    }

    let attestationResponse: RegistrationCredentialJSON;
    try {
      attestationResponse = await startRegistration(registrationOptions);
    } catch (e) {
      console.error("Error getting user credentials:", e);
      form.setErrors({
        genericError: ErrorMessages.userDeclinedRegistrationOrTimeout,
      });
      throw e;
    }

    try {
      await verifyDeviceRegistration(attestationResponse);
    } catch (e) {
      console.error("Error verifying device credentials", e);
      if (e instanceof Error) {
        form.setErrors({
          genericError: e.message,
        });
      } else {
        form.setErrors({
          genericError: ErrorMessages.somethingWentWrong,
        });
      }
      throw e;
    }
  });

  return (
    <Form state={form} aria-labelledby="sign-up">
      <div className="flex flex-col">
        <FormLabel
          name={form.names.deviceName}
          className="mb-1 after:ml-1 after:text-danger-400 after:content-['*']"
        >
          Device Name
        </FormLabel>
        <FormInput
          type="text"
          autoComplete="username webauthn"
          name={form.names.deviceName}
          required
          placeholder="iPhone"
          className="text-input peer"
        />
        <FormDescription
          className="pt-2 text-xs text-neutral-400"
          name={form.names.deviceName}
        >
          Helps to identify your devices associated with your wallet
        </FormDescription>
        <FormError
          name={form.names.deviceName}
          className="pt-1 text-sm text-danger-400"
        />
      </div>
      <div className="flex flex-col pt-3">
        <FormLabel name={form.names.email} className="mb-1">
          Email
        </FormLabel>
        <FormInput
          type="email"
          autoComplete="email"
          name={form.names.email}
          placeholder="you@example.com"
          className="text-input"
        />
        <FormDescription
          className="pt-2 text-xs text-neutral-400"
          name={form.names.email}
        >
          Only used to contact you with updates to your account or wallet
        </FormDescription>
        <FormError
          name={form.names.email}
          className="pt-1 text-sm text-danger-400"
        />
      </div>
      <div className="pt-5">
        <FormSubmit className="btn w-full">Create new account</FormSubmit>
        <FormError
          name={form.names.genericError}
          className="pt-2 text-sm text-danger-400"
        />
      </div>
    </Form>
  );
};

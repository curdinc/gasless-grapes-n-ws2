import { startRegistration } from "@simplewebauthn/browser";
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
import Link from "next/link";
import router, { useRouter } from "next/router";

export const SignUpForm = () => {
  const { redirectUrl } = useRouter().query;
  const form = useFormState({
    defaultValues: { deviceName: "", email: "", genericError: "" },
  });
  const utils = trpc.useContext();
  form.useSubmit(async () => {
    let registrationOptions: PublicKeyCredentialCreationOptionsJSON;
    try {
      const _registrationOptions =
        await utils.webAuthn.getRegistrationOptions.getData();
      if (!_registrationOptions) {
        throw new Error("Missing registrationOptions");
      }
      registrationOptions = _registrationOptions;
      console.log("registrationOptions", registrationOptions);
    } catch (e) {
      console.error("Error Fetching registration options", e);
      form.setErrors({
        genericError: ErrorMessages.somethingWentWrong,
      });
      return;
    }

    let attestationResponse: RegistrationCredentialJSON;
    try {
      attestationResponse = await startRegistration(registrationOptions);
    } catch (e) {
      console.error("Error getting user credentials:", e);
      form.setErrors({
        genericError: ErrorMessages.userDeclinedRegistration,
      });
      return;
    }

    try {
      const result = await verifyDeviceRegistration(attestationResponse);
    } catch (e) {
      console.error("Error verifying device credentials");
      form.setErrors({
        genericError: ErrorMessages.userDeclinedRegistration,
      });
      return;
    }
  });

  const { mutateAsync: verifyDeviceRegistration } =
    trpc.webAuthn.verifyRegistration.useMutation({
      onError(error, variables) {
        console.error("registration error", error);
        console.log("variables", variables);
      },
      onSuccess(data, variables) {
        console.log("registration data", data);
        console.log("variables", variables);
        if (typeof redirectUrl === "string") {
          router.push(redirectUrl);
        }
      },
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
          className="w-full rounded-lg bg-neutral-400 p-2 text-neutral-900  placeholder:text-neutral-700 focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-transparent aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger-400"
        />
        <FormDescription
          className="pt-2 text-sm text-neutral-400"
          name={form.names.deviceName}
        >
          Helps identify your device when managing access to your wallet
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
          className="w-full rounded-lg bg-neutral-400 p-2 text-neutral-900  placeholder:text-neutral-700 focus:ring-1 focus:ring-primary-500 focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-transparent aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger-400"
        />
        <FormDescription
          className="pt-2 text-sm text-neutral-400"
          name={form.names.email}
        >
          In the event that we need to contact your for updates regarding your
          account
        </FormDescription>
        <FormError
          name={form.names.email}
          className="pt-1 text-sm text-danger-400"
        />
      </div>
      <div className="pt-5">
        <FormSubmit className="btn w-full">Sign Up</FormSubmit>
        <FormError
          name={form.names.genericError}
          className="pt-2 text-sm text-danger-400"
        />
        <p className="pt-2 text-sm text-neutral-400">
          Already have an account?{" "}
          <Link className="link" href={Routes.signIn}>
            Sign In
          </Link>
        </p>
      </div>
    </Form>
  );
};

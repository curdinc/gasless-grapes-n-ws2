import { SignUpForm } from "@components/pages/auth/SignUpForm";
import { startRegistration } from "@simplewebauthn/browser";
import type { RegistrationCredentialJSON } from "@simplewebauthn/typescript-types";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();
  const { redirectUrl } = useRouter().query;

  const { data } = trpc.webAuthn.getRegistrationOptions.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: verifyDeviceRegistration } =
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
    verifyDeviceRegistration(attestationResponse);
  };

  return (
    <div className={"flex h-full flex-1 items-center justify-center"}>
      <div className="flex max-w-md flex-col p-14">
        <h1 className="">Sign Up </h1>
        <p className="mb-5 py-1 text-sm text-neutral-400">
          Register your device to begin
        </p>

        <SignUpForm />
      </div>
    </div>
  );
}

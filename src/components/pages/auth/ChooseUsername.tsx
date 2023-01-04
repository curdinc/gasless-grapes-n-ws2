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
import { useRouter } from "next/router";

export const ChooseUsername = () => {
  const router = useRouter();
  const redirectUrl = router.query[Routes.authRedirectQueryParam];
  const { mutateAsync: verifyHandle } = trpc.user.verifyHandle.useMutation();

  const form = useFormState({
    defaultValues: { handle: "", email: "", genericError: "" },
  });

  form.useSubmit(async () => {
    try {
      const { userAlreadyExists } = await verifyHandle({
        handle: form.values.handle,
        email: form.values.email || undefined,
      });
      if (userAlreadyExists) {
        form.setErrors({ genericError: ErrorMessages.userAlreadyExists });
        return;
      }
      router.push(
        Routes.getAbsolutePath(
          Routes.newUser(form.values.handle),
          typeof redirectUrl === "string"
            ? {
                [Routes.authRedirectQueryParam]: redirectUrl,
              }
            : undefined
        )
      );
    } catch (e) {
      console.error("Error verifying user handle", e);
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
    <Form state={form} aria-labelledby="choose user handle">
      <div className="flex flex-col">
        <FormLabel
          name={form.names.handle}
          className="mb-1 after:ml-1 after:text-danger-400 after:content-['*']"
        >
          User Handle
        </FormLabel>
        <FormInput
          type="text"
          autoComplete="username"
          name={form.names.handle}
          required
          placeholder="SatoshiNakamoto123"
          className="text-input peer"
        />
        <FormDescription
          className="pt-2 text-xs text-neutral-400"
          name={form.names.handle}
        >
          Helps to identify your devices associated with your wallet
        </FormDescription>
        <FormError
          name={form.names.handle}
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
          Used to contact you with important updates to your account or wallet
          if you want
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

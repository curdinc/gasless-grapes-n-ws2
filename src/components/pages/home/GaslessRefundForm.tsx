import { SignInWithEthereum } from "@components/wagmi/SignInWithEthereum";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@utils/trpc";
import {
  Form,
  FormDescription,
  FormError,
  FormInput,
  FormLabel,
  FormPush,
  FormRemove,
  FormSubmit,
  useFormState,
} from "ariakit/form";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";

export const GaslessRefundForm = () => {
  const { data: siweUser } = trpc.siwe.me.useQuery(undefined);
  const [siweErrorMessage, setSiweErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const form = useFormState({
    defaultValues: {
      _error: "",
      accessCode: "",
      transactions: [""],
      email: "",
    },
  });
  const { mutateAsync: submitGasRefund } =
    trpc.gasRefund.submitRefund.useMutation();

  form.useSubmit(async () => {
    setIsSubmittingRefund(true);
    try {
      await submitGasRefund({
        email: form.values.email,
        accessCode: form.values.accessCode,
        transactions: form.values.transactions.filter(
          (transaction) => transaction !== null
        ),
      });
      setIsSubmittingRefund(false);
      setIsSubmitted(true);
    } catch (e) {
      setIsSubmittingRefund(false);
      if (e instanceof TRPCClientError) {
        form.setErrors({ _error: e.message });
      }
      throw e;
    }
  });

  return (
    <div>
      <h2 className="w-full pt-5 pb-7 text-center font-heading text-2xl font-bold text-primary-300">
        Start saving gas today.
      </h2>
      <Form state={form} aria-labelledby="gas-refund">
        <div className="flex flex-col">
          <FormLabel
            className="mb-1 after:ml-1 after:text-danger-400 after:content-['*']"
            name={form.names.email}
          >
            Email
          </FormLabel>
          <FormInput
            type="email"
            name={form.names.email}
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="text-input"
          />
          <FormDescription
            className="pt-2 text-xs text-neutral-400"
            name={form.names.email}
          >
            We&apos;ll use this to keep you updated on your refund status.
          </FormDescription>
          <FormError name={form.names.email} className="py-2 text-danger-400" />
        </div>
        <div className="flex flex-col">
          <FormLabel
            className="mb-1 after:ml-1 after:text-danger-400 after:content-['*']"
            name={form.names.accessCode}
          >
            Access Code
          </FormLabel>
          <FormInput
            type="text"
            name={form.names.accessCode}
            required
            placeholder="UBbfehaoW"
            autoComplete="one-time-code"
            className="text-input"
          />
          <FormDescription
            className="pt-2 text-xs text-neutral-400"
            name={form.names.accessCode}
          >
            Go follow Gasless Grapes twitter to figure out how to get the access
            code!
          </FormDescription>
          <FormError
            name={form.names.accessCode}
            className="py-2 text-danger-400"
          />
        </div>
        <div className="flex flex-col">
          <FormLabel
            className="mb-1 after:ml-1 after:text-danger-400 after:content-['*']"
            name={form.names.accessCode}
          >
            Transaction Links
          </FormLabel>
          <FormDescription
            className="pb-2 text-xs text-neutral-400"
            name={form.names.transactions}
          >
            Be Careful! Submitting transaction that is not made by the wallet
            you signed in with will void your access code.
          </FormDescription>
          {form.values.transactions.map((transaction, index) => {
            return (
              transaction !== null && (
                <div key={index}>
                  <div className="flex-row items-baseline">
                    <FormInput
                      type="url"
                      name={form.names.transactions[index] ?? ""}
                      required
                      placeholder="https://polygonscan.com/tx/0x9ef08..."
                      inputMode="url"
                      className="text-input mr-3"
                    />
                    <FormRemove
                      name={form.names.transactions}
                      index={index}
                      className="scale-125"
                    >
                      <IoTrash />
                    </FormRemove>
                  </div>
                  <FormError
                    name={form.names.transactions}
                    className="py-2 text-danger-400"
                  />
                </div>
              )
            );
          })}
          <FormPush
            name={form.names.transactions}
            value=""
            className="link w-full text-center"
          >
            Add transaction for refund
          </FormPush>
        </div>
        {siweUser?.address && (
          <div className="py-3">
            <FormSubmit
              className="btn w-full text-base"
              disabled={isSubmittingRefund}
            >
              Enter the draw for the transaction refund
            </FormSubmit>
            {isSubmitted && (
              <p className="mt-1 w-full text-sm text-success-400">
                Transactions submitted! We&apos;ll be processing all the
                transactions and be in touch shortly!
              </p>
            )}
          </div>
        )}
        <FormError
          name={form.names._error}
          className="mt-1 w-full text-sm text-danger-400"
        />
      </Form>
      {!siweUser?.address && (
        <div className="py-3">
          <SignInWithEthereum
            onSignInError={async ({ error }) => {
              setSiweErrorMessage(error.message);
            }}
            onConnectWalletError={async ({ error }) => {
              setSiweErrorMessage(error.message);
            }}
          />
          {siweErrorMessage && (
            <p className="mt-1 w-full text-center text-sm text-danger-400">
              {siweErrorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

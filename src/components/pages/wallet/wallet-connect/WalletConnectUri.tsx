import { Button } from "@components/ui/input/Button";
import { ErrorMessages } from "@utils/messages";
import { WalletConnectClient } from "@utils/WalletConnect/walletConnectClient";
import { createLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { parseUri } from "@walletconnect/utils";
import {
  Form,
  FormError,
  FormInput,
  FormLabel,
  FormSubmit,
  useFormState,
} from "ariakit/form";
import { useState } from "react";

export function WalletConnectUri() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormState({ defaultValues: { walletConnectUri: "" } });

  form.useSubmit(async () => {
    setIsLoading(true);
    const uri = form.values.walletConnectUri;
    try {
      const { version } = parseUri(uri);
      // Route the provided URI to the v1 SignClient if URI version indicates it, else use v2.
      if (version === 1) {
        createLegacySignClient({ uri });
      } else {
        await WalletConnectClient.pair({ uri: form.values.walletConnectUri });
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (e instanceof Error) {
        if (e.message.includes(ErrorMessages.WalletConnect.invalidUri)) {
          form.setErrors({
            walletConnectUri: ErrorMessages.invalidUri,
          });
        } else {
          form.setErrors({ walletConnectUri: e.message });
        }
      }
    }
  });

  return (
    <Form state={form} aria-labelledby="connect-to-wallet-connect">
      <div>
        <FormLabel name={form.names.walletConnectUri} className="mb-1 text-sm">
          Wallet Connect URI
        </FormLabel>
        <div className="flex-row space-x-3">
          <FormInput
            name={form.names.walletConnectUri}
            required
            placeholder="wc:a281567bb3e4..."
            disabled={isLoading}
            className="text-input"
          />
          <FormSubmit className="btn" as={Button} disabled={isLoading}>
            Connect
          </FormSubmit>
        </div>
        <FormError
          name={form.names.walletConnectUri}
          className="mt-2 text-sm text-danger-400"
        />
      </div>
    </Form>
  );
}

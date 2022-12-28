import { trpc } from "@utils/trpc";
import { useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { ConnectWallet } from "./ConnectWallet";

export function SignInWithEthereumButton({
  onSuccess,
  onError,
}: {
  onSuccess?: (args: { address: string }) => void | Promise<void>;
  onError?: (args: { error: Error }) => void | Promise<void>;
}) {
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const { data: nonce, refetch: getNewNonce } = trpc.siwe.nonce.useQuery(
    undefined,
    {
      onError(err) {
        if (onError) {
          onError({ error: new Error(err.message) });
        }
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const { mutateAsync: verifySignature } = trpc.siwe.verify.useMutation();

  const signIn = async (nonce?: string) => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId || !nonce) {
        console.error(
          "Missing user's address and chainId. Make sure to connect the user's wallet first"
        );
        return;
      }

      setIsSigningMessage(true);
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the Gasless Grape.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const { address: verifiedAddress } = await verifySignature({
        message,
        signature,
      });

      setIsSigningMessage(false);
      if (onSuccess) {
        onSuccess({ address: verifiedAddress });
      }
    } catch (error) {
      await getNewNonce();
      setIsSigningMessage(false);
      if (onError) {
        onError({ error: error as Error });
      }
    }
  };

  return (
    <button
      disabled={!nonce || isSigningMessage}
      onClick={() => signIn(nonce)}
      className="btn w-full"
    >
      Sign-In with Ethereum
    </button>
  );
}
export const SignInWithEthereum = ({
  onSignIn,
  onSignInError,
}: {
  onSignIn?: (args: { address: string }) => void | Promise<void>;
  onSignInError?: (args: { error: Error }) => void | Promise<void>;
}) => {
  const { isConnected } = useAccount();
  const utils = trpc.useContext();
  const { data: siweUser, refetch: refetchSiweUser } =
    trpc.siwe.me.useQuery(undefined);
  const { mutate: logout } = trpc.siwe.logout.useMutation({
    async onSuccess() {
      utils.siwe.me.invalidate();
      utils.siwe.nonce.invalidate();
    },
  });

  if (!isConnected) {
    return <ConnectWallet />;
  }
  if (!siweUser) {
    return <div>loading...</div>;
  }
  return siweUser.address ? (
    <div>
      <div>Signed in as {siweUser.address}</div>
      <button
        className="btn"
        onClick={async () => {
          logout();
        }}
      >
        Log Out
      </button>
    </div>
  ) : (
    <SignInWithEthereumButton
      onSuccess={(args) => {
        refetchSiweUser();
        if (onSignIn) {
          onSignIn(args);
        }
      }}
      onError={onSignInError}
    />
  );
};

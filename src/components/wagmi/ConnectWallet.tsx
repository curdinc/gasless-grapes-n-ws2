import { Button } from "@components/input/Button";
import type { ErrorCallbackType, VoidReturnType } from "types/functionCallback";
import { useConnect } from "wagmi";

export type ConnectWalletProps = {
  onSuccess?: (args: { address: string; chainId: number }) => VoidReturnType;
  onError?: ErrorCallbackType;
};

export const ConnectWallet = ({ onError, onSuccess }: ConnectWalletProps) => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    onError(error) {
      if (onError) {
        onError({ error });
      }
    },
    onSuccess(data) {
      if (onSuccess) {
        onSuccess({
          address: data.account,
          chainId: data.chain.id,
        });
      }
    },
  });
  // const { address, connector, isConnected } = useAccount();
  // const { data: ensAvatar } = useEnsAvatar({ address });
  // const { data: ensName } = useEnsName({ address });
  // const { disconnect } = useDisconnect();

  // if (isConnected) {
  //   return (
  //     <div>
  //       {ensAvatar && <Image src={ensAvatar} alt="ENS Avatar" />}
  //       <div>{ensName ? `${ensName} (${address})` : address}</div>
  //       <div>Connected to {connector?.name}</div>
  //       <button onClick={() => disconnect()}>Disconnect</button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col space-y-2">
      {connectors.map((connector) => {
        if (connector.id == "injected") {
          return (
            <Button
              className="btn"
              disabled={
                !connector.ready ||
                (isLoading && connector.id === pendingConnector?.id)
              }
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              Connect {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </Button>
          );
        }
      })}
    </div>
  );
};

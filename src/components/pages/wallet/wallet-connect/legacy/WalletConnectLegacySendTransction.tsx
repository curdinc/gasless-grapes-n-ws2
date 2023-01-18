import { Button } from "@components/ui/input/Button";
import type { IClientMeta } from "@walletconnect/legacy-types";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import { WalletConnectProjectInfo } from "../WalletConnectProjectInfo";

export type WalletConnectLegacySendTransactionProps = {
  projectDetails: IClientMeta;
  transactionDetails: { id: number; method: string; params: unknown[] };
};
export const WalletConnectLegacySendTransaction = (
  props: WalletConnectLegacySendTransactionProps
) => {
  console.log("props", props);
  const { closeWalletConnectModal: closeModal, user } =
    userWalletStore.getState();
  const onApprove = async () => {
    closeModal();
  };
  const onReject = () => {
    closeModal();
  };
  userWalletStore.setState({ onReject });

  const { projectDetails, transactionDetails } = props;

  return (
    <div>
      <div>
        <WalletConnectProjectInfo {...projectDetails} />
      </div>
      <div className="mt-3 flex-row justify-end">
        <Button
          className="btn mr-3 bg-neutral-600"
          onClick={() => {
            onReject();
          }}
        >
          Reject
        </Button>
        <Button
          className="btn"
          onClick={() => {
            onApprove();
          }}
        >
          Approve
        </Button>
      </div>
    </div>
  );
};

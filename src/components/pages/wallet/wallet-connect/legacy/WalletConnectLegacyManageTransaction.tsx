import { Button } from "@components/ui/input/Button";
import { ErrorMessages } from "@utils/messages";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { WebAuthnUtils } from "@utils/webAuthn";
import type { IClientMeta } from "@walletconnect/legacy-types";
import { getSdkError } from "@walletconnect/utils";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import { WalletConnectProjectInfo } from "../WalletConnectProjectInfo";

export type WalletConnectLegacyManageTransactionProps = {
  projectDetails: IClientMeta;
  transactionDetails: { id: number; method: string; params: unknown[] };
  isSendTransaction: boolean;
};
export const WalletConnectLegacyManageTransaction = (
  props: WalletConnectLegacyManageTransactionProps
) => {
  console.log("props", props);
  const { projectDetails, transactionDetails } = props;
  const { closeWalletConnectModal, currentChainId } =
    userWalletStore.getState();
  const onApprove = async () => {
    const wallet = await WebAuthnUtils.getAssociatedEoaWallet({
      chainId: currentChainId,
    });
    if (!wallet) {
      throw new Error(ErrorMessages.missingEoaWallet);
    }
    let result: string;
    if (props.isSendTransaction) {
      // TODO: send things through the smart contract
      const transaction = await wallet.sendTransaction(
        transactionDetails.params[0] as any
      );
      result = transaction.hash || "";
    } else {
      result = await wallet.signTransaction(
        transactionDetails.params[0] as any
      );
    }
    walletConnectLegacySignClient.approveRequest({
      id: transactionDetails.id,
      jsonrpc: "2.0",
      result,
    });
    closeWalletConnectModal();
  };
  const onReject = () => {
    walletConnectLegacySignClient.rejectRequest({
      id: transactionDetails.id,
      jsonrpc: "2.0",
      error: {
        message: getSdkError("USER_REJECTED_METHODS").message,
      },
    });
    closeWalletConnectModal();
  };
  userWalletStore.setState({ onReject });

  return (
    <div>
      <div>
        <WalletConnectProjectInfo {...projectDetails} />
      </div>
      <div>
        <pre>{JSON.stringify(transactionDetails.params, null, 2)}</pre>
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

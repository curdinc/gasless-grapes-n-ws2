import { Button } from "@components/ui/input/Button";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { WebAuthnUtils } from "@utils/webAuthn";
import type { IClientMeta } from "@walletconnect/legacy-types";
import { getSdkError } from "@walletconnect/utils";
import { walletConnectStore } from "hooks/stores/useWalletConnectStore";
import { WalletConnectProjectInfo } from "../WalletConnectProjectInfo";

export type WalletConnectLegacySessionRequestProps = {
  id: number;
  params: [{ chainId: number; peerId: string; peerMeta: IClientMeta }];
};
export const WalletConnectLegacySessionRequest = (
  props: WalletConnectLegacySessionRequestProps
) => {
  console.log("props", props);
  const { closeModal, user } = walletConnectStore.getState();
  const onApprove = async () => {
    const wallet = WebAuthnUtils.getAssociatedEoaWallet({
      chainId: chainId ?? 1,
      deviceName: user.currentDeviceName,
      userId: user.id,
    });
    if (!wallet) {
      // TODO: make a toast to warn of error
      return;
    }
    walletConnectLegacySignClient.approveSession({
      accounts: [wallet.address],
      chainId: chainId ?? 1,
    });
    closeModal();
  };
  const onReject = () => {
    walletConnectLegacySignClient.rejectSession(
      getSdkError("USER_REJECTED_METHODS")
    );
    closeModal();
  };
  walletConnectStore.setState({ onReject });

  const { params } = props;
  const [{ chainId, peerMeta }] = params;

  return (
    <div>
      <div>
        <WalletConnectProjectInfo {...peerMeta} />
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

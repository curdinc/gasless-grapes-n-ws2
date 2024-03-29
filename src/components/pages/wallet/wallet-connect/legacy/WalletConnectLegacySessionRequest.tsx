import { Button } from "@components/ui/input/Button";
import { ErrorMessages } from "@utils/messages";
import { Routes } from "@utils/routes";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import type { IClientMeta } from "@walletconnect/legacy-types";
import { getSdkError } from "@walletconnect/utils";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import router from "next/router";
import { SupportedChainIdsSchema } from "types/schema/blockchain/chains";
import { WalletConnectProjectInfo } from "../WalletConnectProjectInfo";

export type WalletConnectLegacySessionRequestProps = {
  id: number;
  params: [{ chainId: number; peerId: string; peerMeta: IClientMeta }];
};
export const WalletConnectLegacySessionRequest = (
  props: WalletConnectLegacySessionRequestProps
) => {
  const { params } = props;
  const [{ chainId, peerMeta }] = params;
  const { closeWalletConnectModal, smartContractWalletDetails } =
    userWalletStore.getState();
  const onApprove = async () => {
    if (!smartContractWalletDetails) {
      throw new Error(ErrorMessages.missingSmartContractWalletDetails);
    }
    const maybeParsedChainId = SupportedChainIdsSchema.safeParse(chainId);
    const parsedChainId = maybeParsedChainId.success
      ? maybeParsedChainId.data
      : undefined;

    walletConnectLegacySignClient.approveSession({
      accounts: [smartContractWalletDetails?.address],
      chainId: parsedChainId ?? 5,
    });
    userWalletStore.setState({
      currentChainId: parsedChainId ?? 5,
      currentSessionDetails: peerMeta,
    });
    router.push(Routes.wallet.walletConnect);
    closeWalletConnectModal();
  };
  const onReject = () => {
    walletConnectLegacySignClient.rejectSession(
      getSdkError("USER_REJECTED_METHODS")
    );
    closeWalletConnectModal();
  };
  userWalletStore.setState({ onReject });

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

import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletConnectLayout } from "@components/layout/WalletConnectLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import { WalletConnectLegacyDisconnectButton } from "@components/pages/wallet/wallet-connect/legacy/WalletConnectLegacyDisconnectButton";
import { WalletConnectProjectInfo } from "@components/pages/wallet/wallet-connect/WalletConnectProjectInfo";
import { ok } from "assert";
import { walletConnectStore } from "hooks/stores/useWalletConnectStore";
import type { NextPage } from "next";
import { useStore } from "zustand";

const WalletConnectPage: NextPage = () => {
  const { currentSession } = useStore(walletConnectStore, (state) => {
    return {
      currentSession: state.currentSessionDetails,
    };
  });

  if (!currentSession) {
    return <div className="mt-10">No Active Sessions</div>;
  }
  return (
    <div className="mt-10">
      <div className="flex-row justify-between">
        <WalletConnectProjectInfo {...currentSession} />
        <WalletConnectLegacyDisconnectButton />
      </div>
    </div>
  );
};

WalletConnectPage.getLayout = (page) => {
  return (
    <BaseLayout>
      <WalletLayout>
        <WalletConnectLayout>{page}</WalletConnectLayout>
      </WalletLayout>
    </BaseLayout>
  );
};

export default WalletConnectPage;

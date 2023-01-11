import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletConnectLayout } from "@components/layout/WalletConnectLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import { WalletConnectProjectInfo } from "@components/pages/wallet/wallet-connect/WalletConnectProjectInfo";
import { walletConnectLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import type { IClientMeta } from "@walletconnect/legacy-types";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const WalletConnectPage: NextPage = () => {
  const [currentSession, setCurrentSession] = useState<IClientMeta | null>(
    null
  );
  useEffect(() => {
    setCurrentSession(walletConnectLegacySignClient?.session.peerMeta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletConnectLegacySignClient?.session.peerMeta]);

  if (!currentSession) {
    return <div className="mt-10">No Active Sessions</div>;
  }
  return (
    <div className="mt-10">
      <div className="flex-row justify-between">
        <WalletConnectProjectInfo {...currentSession} />
        {/* <WalletConnectLegacyDisconnectButton /> */}
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

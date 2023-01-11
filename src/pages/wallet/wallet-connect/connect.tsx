import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletConnectLayout } from "@components/layout/WalletConnectLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import { WalletConnectUri } from "@components/pages/wallet/wallet-connect/WalletConnectUri";
import type { NextPage } from "next";

const ConnectToDappPage: NextPage = () => {
  return (
    <div className="mt-10">
      <WalletConnectUri />
    </div>
  );
};

ConnectToDappPage.getLayout = (page) => {
  return (
    <BaseLayout>
      <WalletLayout>
        <WalletConnectLayout>{page}</WalletConnectLayout>
      </WalletLayout>
    </BaseLayout>
  );
};

export default ConnectToDappPage;

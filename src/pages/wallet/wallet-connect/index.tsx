import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletConnectLayout } from "@components/layout/WalletConnectLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import type { NextPage } from "next";

const WalletConnectPage: NextPage = () => {
  return <div>Wallet connect page</div>;
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

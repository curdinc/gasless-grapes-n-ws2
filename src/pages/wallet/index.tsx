import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import { BasicTokenView } from "@components/pages/wallet/Tokens/BasicTokenView";
import type { NextPage } from "next";

const WalletPage: NextPage = () => {
  return <BasicTokenView />;
};

WalletPage.getLayout = (page) => {
  return (
    <BaseLayout>
      <WalletLayout>{page}</WalletLayout>
    </BaseLayout>
  );
};

export default WalletPage;

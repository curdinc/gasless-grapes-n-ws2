import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import type { NextPage } from "next";

const SettingsPage: NextPage = () => {
  return <div>Settings page</div>;
};

SettingsPage.getLayout = (page) => {
  return (
    <BaseLayout>
      <WalletLayout>{page}</WalletLayout>
    </BaseLayout>
  );
};

export default SettingsPage;

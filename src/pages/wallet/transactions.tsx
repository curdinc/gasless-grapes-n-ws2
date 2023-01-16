import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import type { NextPage } from "next";

const TransactionsPage: NextPage = () => {
  return <div>Transactions page</div>;
};

TransactionsPage.getLayout = (page) => {
  return (
    <BaseLayout>
      <WalletLayout>{page}</WalletLayout>
    </BaseLayout>
  );
};

export default TransactionsPage;

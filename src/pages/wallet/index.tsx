import { Routes } from "@utils/routes";
import type { GetServerSideProps, NextPage } from "next";

const WalletPage: NextPage = () => {
  return null;
};

export default WalletPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: Routes.wallet.tokens,
      permanent: false,
    },
  };
};

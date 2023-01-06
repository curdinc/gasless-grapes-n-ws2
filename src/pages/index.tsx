import { BaseLayout } from "@components/layout/BaseLayout";
import { Button } from "@components/ui/input/Button";
import { Routes } from "@utils/routes";
import type { NextPage } from "next";
import Head from "next/head";
import router from "next/router";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gasless Grapes</title>
        <meta
          name="description"
          content="Home of the world's first gasless wallet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={"mx-auto max-w-lg p-10"}>
          <div className="w-full items-center space-y-10">
            <div className="text-8xl md:text-9xl">🍇</div>
            <h1
              className={
                "text-center font-heading text-3xl font-bold text-primary-300 "
              }
            >
              Make your devices your most secure hardware wallet.
            </h1>
          </div>

          <Button
            className="btn mt-10 text-lg"
            onClick={() => {
              router.push(Routes.wallet);
            }}
          >
            Secure your assets
          </Button>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Home;

export { reportWebVitals } from "next-axiom";
import { BaseLayout } from "@components/layout/BaseLayout";
import "@styles/globals.css";
import { trpc } from "@utils/trpc";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppWithLayoutType } from "next/app";
import Head from "next/head";

const MyApp: AppWithLayoutType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <BaseLayout>{page}</BaseLayout>);
  return (
    <>
      <Head>
        <title>Gasless Grapes | Web3 Wallet</title>
        <meta
          name="description"
          content="Home of the world's first gasless web3 wallet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
      <Analytics />
    </>
  );
};

export default trpc.withTRPC(MyApp);

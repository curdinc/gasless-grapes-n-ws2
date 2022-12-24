import { Inter, Nunito } from '@next/font/google';
import "@styles/globals.css";
import { trpc } from "@utils/trpc";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";

const inter = Inter({
  subsets: ['latin-ext'],
  variable: '--font-inter',})
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',})


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`${inter.variable} ${nunito.variable} font-sans`}>

      <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

import { LogoutButton } from "@components/pages/wallet/LogoutButton";
import { Inter, Nunito } from "@next/font/google";
import { Routes } from "@utils/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const inter = Inter({
  subsets: ["latin-ext"],
  variable: "--font-inter",
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <main
      className={`${inter.variable} ${nunito.variable} flex min-h-screen flex-col bg-neutral-900 font-sans text-neutral-100`}
    >
      <nav className="flex items-baseline justify-between px-3 py-4">
        <Link href={Routes.home} className="font-heading text-xl">
          🍇 Gasless Grapes
        </Link>
        {router.pathname !== Routes.home && (
          <p>
            Note: This is still an early prototype, use at your own risk.{" "}
            <a
              href="https://discord.gg/h3BzmdCW"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              Chat with us on Discord
            </a>{" "}
            to help shape the future of Gasless Grapes!
          </p>
        )}
        {router.pathname === Routes.home && (
          <a className="link mr-3" href={Routes.wallet.home}>
            Try Alpha
          </a>
        )}
        {router.pathname.startsWith(Routes.wallet.home) && <LogoutButton />}
      </nav>
      {children}
    </main>
  );
};

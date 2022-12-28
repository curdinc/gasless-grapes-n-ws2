import { env } from "@env/client.mjs";
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
        {!(
          router.pathname === Routes.signIn || router.pathname === Routes.signUp
        ) &&
          env.NEXT_PUBLIC_NODE_ENV === "development" && (
            <Link className="link mr-2" href={Routes.signUp}>
              Try Alpha
            </Link>
          )}
      </nav>
      {children}
    </main>
  );
};

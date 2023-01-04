import { Routes } from "@utils/routes";
import Link from "next/link";
import React from "react";

export const WalletLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="m-8 mx-auto grid max-w-3xl grid-cols-12 overflow-hidden rounded-xl ">
      <nav className="col-span-4 bg-neutral-800 p-10">
        <ul className="space-y-9">
          <li>
            <Link className="link" href={Routes.tokens}>
              Tokens
            </Link>
          </li>
          <li>
            <Link className="link" href={Routes.transactions}>
              Transactions
            </Link>
          </li>
          <li>
            <Link className="link" href={Routes.settings}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="cols-span-5">{children}</div>
    </div>
  );
};

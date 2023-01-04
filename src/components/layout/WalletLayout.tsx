import { Routes } from "@utils/routes";
import Link from "next/link";
import React from "react";
import {
  IoListOutline,
  IoSettingsOutline,
  IoWalletOutline,
} from "react-icons/io5";

export const WalletLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="m-10 mx-auto grid w-full max-w-3xl flex-1 grid-cols-12 overflow-hidden rounded-xl">
      <nav className="col-span-4 border-r-2 border-r-neutral-700 bg-neutral-800 p-10">
        <ul className="space-y-9">
          <li>
            <Link className="link flex items-center" href={Routes.wallet}>
              <IoWalletOutline className="mr-2" /> Tokens
            </Link>
          </li>
          <li>
            <Link className="link flex items-center" href={Routes.wallet}>
              <IoListOutline className="mr-2" /> Transactions
            </Link>
          </li>
          <li>
            <Link className="link flex items-center" href={Routes.wallet}>
              <IoSettingsOutline className="mr-2" /> Settings
            </Link>
          </li>
        </ul>
      </nav>
      <div className="col-span-8 bg-neutral-800">{children}</div>
    </div>
  );
};

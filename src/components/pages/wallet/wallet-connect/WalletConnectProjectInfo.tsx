/* eslint-disable @next/next/no-img-element */
import type { SignClientTypes } from "@walletconnect/types";
import Link from "next/link";

export const WalletConnectProjectInfo = ({
  description,
  icons,
  name,
  url,
}: SignClientTypes.Metadata) => {
  return (
    <div className="flex-row items-center">
      <div className="mr-4">
        <img
          className="aspect-square"
          width={"48"}
          height={"48"}
          src={icons[0] ?? ""}
          alt={`${name} icon`}
        />
      </div>
      <div>
        <div>{name}</div>
        <Link className="link" href={url}>
          {url}
        </Link>
      </div>
    </div>
  );
};

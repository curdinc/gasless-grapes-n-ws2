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
      {icons[0] && (
        <div className="mr-4 flex-shrink-0">
          <img
            className="aspect-square"
            width={"48"}
            height={"48"}
            src={icons[0]}
            alt={`${name} icon`}
          />
        </div>
      )}
      <div className="w-full">
        <div>{name}</div>
        <Link
          className="link max-w-[150px] truncate md:max-w-[240px]"
          href={url}
        >
          {url}
        </Link>
      </div>
    </div>
  );
};

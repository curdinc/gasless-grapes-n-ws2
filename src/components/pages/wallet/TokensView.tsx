import { copyToClipboard } from "@utils/copyToClipboard";
import { trpc } from "@utils/trpc";
import { formatUnits } from "ethers/lib/utils";
import Image from "next/image";
import type { TokenDetailType } from "types/schema/alchemy/tokenApi";
import { productionChains } from "types/schema/blockchain/chains";

export const TokensView = ({ walletAddress }: { walletAddress?: string }) => {
  console.log("walletAddress", walletAddress);
  const { data: tokens } = trpc.token.getBalance.useQuery(
    {
      walletAddress: "0xb3e9c57fb983491416a0c77b07629c0991c3fd59" ?? "",
    },
    {
      enabled: !!walletAddress,
    }
  );
  return (
    <div className="space-y-5">
      {...productionChains.map((productionChain) => {
        return tokens?.[productionChain].map((token) => {
          return <TokenViewer key={token.contractAddress} {...token} />;
        });
      })}
    </div>
  );
};

export const TokenViewer = ({
  contractAddress,
  decimals,
  logo,
  name,
  symbol,
  tokenBalance,
}: TokenDetailType) => {
  const copyAddressToClipboard = async () => {
    const copied = await copyToClipboard(contractAddress);
    if (copied) {
      // TODO: Do a toast!
    }
  };

  const shortenedSymbol = symbol.slice(0, 5);
  return (
    <div className="flex-row items-center space-x-3">
      {logo && (
        <div>
          <Image
            src={logo}
            alt={`${name} logo`}
            onClick={copyAddressToClipboard}
            width="32"
            height="32"
          />
        </div>
      )}
      <div className="flex-1 flex-row justify-between">
        <div>
          <div className="font-heading text-lg">
            {" "}
            {shortenedSymbol} {symbol !== shortenedSymbol ? "..." : ""}
          </div>
          <div className="mt-1 text-xs text-neutral-400">{name}</div>
        </div>
        <div className="items-end">
          <div className="font-heading text-lg">$10.00</div>
          <div className="mt-1 text-xs text-neutral-400">
            {Math.round(
              parseFloat(formatUnits(tokenBalance, decimals)) * 10000
            ) / 10000}{" "}
            {shortenedSymbol} {symbol !== shortenedSymbol ? "..." : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

import { Currency } from "@utils/curreency";
import Image from "next/image";

export type TokenDisplayProps = {
  icon: string;
  name: string;
  balance: string;
  symbol: string;
  fiatCurrency: string;
  fiatValue: number;
};
export const TokenDisplay = ({
  balance,
  fiatCurrency,
  fiatValue,
  icon,
  name,
  symbol,
}: TokenDisplayProps) => {
  return (
    <div className="w-full flex-row items-center justify-between">
      <div className="flex-row items-center">
        <div>
          <Image
            src={icon}
            alt={`${name} icon`}
            width="32"
            height="32"
            className="mr-3 aspect-square"
          />
        </div>
        <div>
          <p className="font-heading font-bold">{name}</p>
          <p className="text-xs text-neutral-400">
            {balance} {symbol}
          </p>
        </div>
      </div>
      <p className="text-bold">{Currency.format(fiatValue, fiatCurrency)}</p>
    </div>
  );
};

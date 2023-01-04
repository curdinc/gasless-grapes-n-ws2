import { Button } from "@components/ui/input/Button";
import { IoAddSharp } from "react-icons/io5";
import { TokenDisplay } from "./TokenDisplay";

export const TokenList = () => {
  return (
    <div className="items-center space-y-4 bg-neutral-800">
      <TokenDisplay
        balance="0.0"
        fiatCurrency="USD"
        fiatValue={0.0}
        name="Ethereum"
        icon="https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
        symbol="ETH"
      />
      <Button className="link flex items-center text-sm">
        <IoAddSharp className="mr-1" />
        Add token
      </Button>
    </div>
  );
};

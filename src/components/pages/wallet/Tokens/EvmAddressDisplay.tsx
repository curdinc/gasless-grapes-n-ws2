import { Blockchain } from "@utils/blockchain";
import { copyToClipboard } from "@utils/copyToClipboard";

export const EvmAddressDisplay = ({ address }: { address: string }) => {
  const copyAddress = () => {
    copyToClipboard(address);
  };
  return (
    <div
      className="cursor-pointer text-xs font-bold text-neutral-400"
      onClick={copyAddress}
    >
      {Blockchain.formatEvmAddress(address)}
    </div>
  );
};

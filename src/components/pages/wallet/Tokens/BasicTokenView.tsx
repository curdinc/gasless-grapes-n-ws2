import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import { useStore } from "zustand";
import { EvmAddressDisplay } from "./EvmAddressDisplay";
import { SendTokenButton } from "./SendTokenButton";
import { TokenList } from "./TokenList";

export const BasicTokenView = () => {
  const { walletDetail } = useStore(userWalletStore, (state) => ({
    walletDetail: state.smartContractWalletDetails,
  }));

  return (
    <div className="mt-10 w-full justify-center">
      <div className="w-full justify-center text-center">
        <h2 className="text-sm text-neutral-400">Net Worth</h2>
        <p className="mt-3 text-3xl font-bold">$0.00</p>
        <div className="mt-2">
          <EvmAddressDisplay address={walletDetail?.address ?? ""} />
        </div>
        <div className="mt-5 flex-row justify-center">
          <SendTokenButton />
        </div>
      </div>
      <div className="mx-5 mt-10">
        <TokenList />
      </div>
    </div>
  );
};

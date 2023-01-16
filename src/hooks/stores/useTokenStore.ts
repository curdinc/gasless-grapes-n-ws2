import type { SmartContractWalletType } from "types/schema/SmartContractWallet";
import { createStore } from "zustand";
import { combine } from "zustand/middleware";

export const TokenViewStore = createStore(
  combine(
    {
      walletDetails: null as SmartContractWalletType | null,
    },
    (set) => {
      return {
        setWalletDetails(walletDetails: SmartContractWalletType) {
          set({ walletDetails });
        },
      };
    }
  )
);

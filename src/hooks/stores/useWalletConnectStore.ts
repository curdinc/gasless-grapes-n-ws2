import type { SignClientTypes } from "@walletconnect/types";
import { useDialogState } from "ariakit";
import type { ethers } from "ethers";
import type React from "react";
import { useEffect } from "react";
import type { AuthUserType } from "types/schema/AuthUserSchema";
import type { SupportedChainIdsType } from "types/schema/blockchain/chains";
import type { SmartContractWalletType } from "types/schema/SmartContractWallet";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

export const userWalletStore = createStore(
  combine(
    {
      accountsToConnect: [] as string[],
      user: {
        currentDeviceName: "",
        handle: "",
        id: "",
        state: "pendingAuthentication",
      } as AuthUserType,
      smartContractWalletDetails: null as SmartContractWalletType | null,
      currentSessionDetails: null as null | SignClientTypes.Metadata,
      eoaWallet: null as ethers.Wallet | null,
      modalError: "",
      isOpenWalletConnectModal: false,
      currentChainId: 5 as SupportedChainIdsType,
      modalTitle: "",
      modalBody: null as React.ReactNode,
      onReject: null as (() => void) | null,
    },
    (set) => {
      return {
        openWalletConnectModal: ({
          modalBody,
          modalTitle,
        }: {
          modalTitle: string;
          modalBody: React.ReactNode;
        }) =>
          set({
            isOpenWalletConnectModal: true,
            modalTitle: modalTitle,
            modalBody: modalBody,
          }),
        closeWalletConnectModal: () =>
          set({
            isOpenWalletConnectModal: false,
            modalBody: null,
            modalTitle: "",
          }),
        setAccountsToConnect: (accounts: string[]) =>
          set({
            accountsToConnect: accounts,
          }),
        setSmartContactWalletDetails(
          smartContractWalletDetails: SmartContractWalletType
        ) {
          set({ smartContractWalletDetails });
        },
        setEoaWalletDetails(eoaWallet: ethers.Wallet) {
          set({ eoaWallet });
        },
      };
    }
  )
);

export const useWalletConnectDialogState = () => {
  const { openModal, closeModal, isOpenModal, onReject } = useStore(
    userWalletStore,
    (state) => {
      return {
        isOpenModal: state.isOpenWalletConnectModal,
        closeModal: state.closeWalletConnectModal,
        openModal: state.openWalletConnectModal,
        onReject: state.onReject,
      };
    }
  );
  const dialog = useDialogState();

  useEffect(() => {
    if (isOpenModal) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [dialog, isOpenModal]);

  const show = () => {
    openModal({ modalBody: null, modalTitle: "" });
  };

  const hide = () => {
    closeModal();
    onReject && onReject();
  };

  const toggle = () => {
    if (!isOpenModal) {
      openModal({ modalBody: null, modalTitle: "" });
    } else {
      closeModal();
    }
  };

  return {
    ...dialog,
    toggle,
    show,
    hide,
  };
};

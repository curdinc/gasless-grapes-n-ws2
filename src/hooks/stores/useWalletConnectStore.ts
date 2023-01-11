import { useDialogState } from "ariakit";
import type React from "react";
import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

export const walletConnectStore = createStore(
  combine(
    {
      accountsToConnect: [] as string[],
      isOpenModal: false,
      modalTitle: "",
      modalBody: null as React.ReactNode,
      onReject: null as (() => void) | null,
    },
    (set) => {
      return {
        openModal: ({
          modalBody,
          modalTitle,
        }: {
          modalTitle: string;
          modalBody: React.ReactNode;
          onReject?: () => void;
          onApprove?: () => void;
        }) =>
          set({
            isOpenModal: true,
            modalTitle: modalTitle,
            modalBody: modalBody,
          }),
        closeModal: () =>
          set({
            isOpenModal: false,
            modalBody: null,
            modalTitle: "",
          }),
        setAccountsToConnect: (accounts: string[]) =>
          set({
            accountsToConnect: accounts,
          }),
      };
    }
  )
);

export const useWalletConnectDialogState = () => {
  const { openModal, closeModal, isOpenModal, onReject } = useStore(
    walletConnectStore,
    (state) => {
      return {
        isOpenModal: state.isOpenModal,
        closeModal: state.closeModal,
        openModal: state.openModal,
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

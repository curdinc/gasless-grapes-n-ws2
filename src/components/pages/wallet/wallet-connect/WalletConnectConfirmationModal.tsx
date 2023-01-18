import { Inter, Nunito } from "@next/font/google";
import { trpc } from "@utils/trpc";
import { createSignClient } from "@utils/WalletConnect/walletConnectClient";
import { createLegacySignClient } from "@utils/WalletConnect/walletConnectLegacyClient";
import { Dialog, DialogHeading } from "ariakit";
import {
  userWalletStore,
  useWalletConnectDialogState,
} from "hooks/stores/useWalletConnectStore";
import { useEffect } from "react";
import { useStore } from "zustand";

const inter = Inter({
  subsets: ["latin-ext"],
  variable: "--font-inter",
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export function WalletConnectConfirmationModal() {
  useEffect(() => {
    createSignClient();
    createLegacySignClient({});
  }, []);

  const { data: user } = trpc.user.me.useQuery();
  useEffect(() => {
    if (user) {
      userWalletStore.setState({
        user,
      });
    }
  }, [user]);

  const { modalBody, modalTitle } = useStore(userWalletStore, (state) => {
    return {
      modalBody: state.modalBody,
      modalTitle: state.modalTitle,
      closeModal: state.closeWalletConnectModal,
    };
  });
  const dialog = useWalletConnectDialogState();

  return (
    <Dialog
      state={dialog}
      className={`${inter.variable} ${nunito.variable} z-50 h-fit max-h-[calc(100%-1rem*2)] w-full max-w-[calc(100%-1rem*2)] overflow-auto rounded-lg bg-neutral-700 px-7 py-5 font-sans text-neutral-100 shadow-lg md:w-[640px]`}
    >
      <DialogHeading className={`mb-5 text-center font-heading`}>
        {modalTitle}
      </DialogHeading>
      {modalBody}
    </Dialog>
  );
}

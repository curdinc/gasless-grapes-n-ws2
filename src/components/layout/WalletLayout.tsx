import { FusionIcon } from "@components/fusion/FusionIcon";
import { WalletConnectConfirmationModal } from "@components/pages/wallet/wallet-connect/WalletConnectConfirmationModal";
import { Spinner } from "@components/ui/progress/Spinner";
import { Routes } from "@utils/routes";
import { trpc } from "@utils/trpc";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IoListOutline, IoWalletOutline } from "react-icons/io5";
import { SmartContractWalletOptions } from "types/schema/SmartContractWallet";
import { useStore } from "zustand";

const links: Array<{ icon: JSX.Element; value: string; link: string }> = [
  {
    icon: <IoWalletOutline className="mr-2" />,
    link: Routes.wallet.tokens,
    value: "Tokens",
  },
  {
    icon: <IoListOutline className="mr-2" />,
    link: Routes.wallet.transactions,
    value: "Transactions",
  },
  {
    icon: (
      <FusionIcon
        className="-ml-1 mr-2 h-[21px] w-[21px] stroke-[2.9px]"
        pack="web3"
        icon="walletconnect"
      />
    ),
    link: Routes.wallet.walletConnect,
    value: "Wallet Connect",
  },
  // {
  //   icon: <IoSettingsOutline className="mr-2" />,
  //   link: Routes.wallet.settings,
  //   value: "Settings",
  // },
];

export const WalletLayout = ({ children }: { children: React.ReactNode }) => {
  const { setSmartContractWalletDetails } = useStore(
    userWalletStore,
    (state) => ({
      setSmartContractWalletDetails: state.setSmartContactWalletDetails,
    })
  );
  const { mutate: deployWalletToChain } =
    trpc.smartContractWallet.deployToNewChain.useMutation({
      onSuccess() {
        refetchWalletDetails();
      },
    });
  const { mutate: createFirstWallet } =
    trpc.smartContractWallet.createNewWallet.useMutation({
      onSuccess({ smartContractWallet }) {
        refetchWalletDetails();
        deployWalletToChain({
          chain: "Goerli",
          walletAddress: smartContractWallet.address,
        });
      },
    });
  const {
    data: userDefaultWalletDetails,
    refetch: refetchWalletDetails,
    isInitialLoading,
  } = trpc.smartContractWallet.getWalletDetailsByType.useQuery(
    { type: SmartContractWalletOptions.Default },
    {
      onSuccess(walletDetails) {
        // set the wallet detail so that we can use it elsewhere
        const walletDetail = walletDetails?.[0];
        if (walletDetail) {
          setSmartContractWalletDetails(walletDetail);
        }

        // set up new wallet if it doesn't exists
        if (!isInitialLoading) {
          return;
        }
        if (!walletDetails?.length) {
          createFirstWallet({
            type: SmartContractWalletOptions.Default,
          });
          return;
        }
        if (!walletDetails[0]?.SmartContractWalletDetails.length) {
          deployWalletToChain({
            chain: "Goerli",
            walletAddress: walletDetails[0]?.address || "",
          });
        }
      },
    }
  );
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <>
      <div className="m-10 mx-auto grid w-full max-w-3xl flex-1 grid-cols-12 overflow-hidden rounded-xl">
        <nav className="col-span-4 border-r-2 border-r-neutral-700 bg-neutral-800 p-10">
          <ul className="space-y-9">
            {links.map((linkDetail) => {
              return (
                <li key={linkDetail.value}>
                  <Link
                    className={`link flex items-center ${
                      currentRoute.startsWith(linkDetail.link)
                        ? "cursor-default text-primary-300 underline"
                        : ""
                    }`}
                    href={linkDetail.link}
                  >
                    {linkDetail.icon} {linkDetail.value}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="col-span-8 bg-neutral-800">
          {userDefaultWalletDetails ? (
            children
          ) : (
            <div className="w-full flex-1 items-center justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
      <WalletConnectConfirmationModal />
    </>
  );
};

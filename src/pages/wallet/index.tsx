import WalletAccountView from "@components/pages/wallet/WalletAccountView";
import { Spinner } from "@components/ui/progress/Spinner";
import { trpc } from "@utils/trpc";

export default function WalletPage() {
  const { mutate: createFirstWallet } =
    trpc.smartContractWallet.createNewWalletDetail.useMutation({
      onSuccess() {
        refetchWalletDetails();
      },
    });
  const { data: userWalletDetails, refetch: refetchWalletDetails } =
    trpc.smartContractWallet.getDefaultWalletDetail.useQuery(undefined, {
      onSuccess(walletDetail) {
        if (!walletDetail) {
          createFirstWallet();
        }
        console.log("walletDetail", walletDetail);
      },
    });
  if (!userWalletDetails) {
    return (
      <div className="w-full flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="py-2 px-4">
      {/* <h1 className="font-heading text-lg font-bold">Account</h1> */}
      <h2 className="text-sm text-neutral-400">Net Worth</h2>
      <p className="mt-3 text-3xl font-bold">$1,022.02</p>
      <div className="mt-10">
        <WalletAccountView />
      </div>
    </div>
  );
}

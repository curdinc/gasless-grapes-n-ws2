import { WalletLayout } from "@components/layout/WalletLayout";
import { BasicTokenView } from "@components/pages/wallet/Tokens/BasicTokenView";
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
    <WalletLayout>
      <BasicTokenView />
    </WalletLayout>
  );
}

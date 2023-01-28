import { BaseLayout } from "@components/layout/BaseLayout";
import { WalletLayout } from "@components/layout/WalletLayout";
import { Blockchain } from "@utils/blockchain";
import { Links } from "@utils/links";
import { trpc } from "@utils/trpc";
import { ethers } from "ethers";
import { userWalletStore } from "hooks/stores/useWalletConnectStore";
import type { NextPage } from "next";
import {
  IoCloudDownloadOutline,
  IoCloudUploadOutline,
  IoOpenOutline,
  IoSyncSharp,
} from "react-icons/io5";
import { useStore } from "zustand";

const TransactionsPage: NextPage = () => {
  const { chainId, walletAddress } = useStore(userWalletStore, (state) => {
    return {
      chainId: state.currentChainId,
      walletAddress: state.smartContractWalletDetails?.address,
    };
  });
  const { data: transactions } =
    trpc.walletTransactions.getTransactions.useQuery({
      chainId,
      walletAddress: walletAddress || "",
    });
  return (
    <div className="m-7">
      <div className="font-heading font-bold">Transactions</div>
      <div className="my-10">
        {transactions ? (
          transactions.map((transaction) => {
            const isSelf = transaction.to === transaction.from;
            const isIncoming = transaction.to === walletAddress;
            let transactionValue = "0.0000 ETH";

            if (ethers.BigNumber.from(transaction.value).gt(0)) {
              transactionValue = isIncoming
                ? `+ ${ethers.utils.formatEther(transaction.value)} ETH`
                : `- ${ethers.utils.formatEther(transaction.value)} ETH`;
            }

            return (
              <div
                className="my-1 flex-row items-center justify-between rounded-xl px-5 py-3 transition-colors hover:bg-neutral-700"
                key={transaction.hash}
              >
                <div className="flex-row items-center">
                  {isSelf ? (
                    <IoSyncSharp className="text-2xl" />
                  ) : isIncoming ? (
                    <IoCloudDownloadOutline className="text-2xl" />
                  ) : (
                    <IoCloudUploadOutline className="text-2xl" />
                  )}
                  <div className="ml-5">
                    <div className="flex-row items-center">
                      <div className="text-bold font-heading text-lg">
                        {isSelf ? "Self" : isIncoming ? "Incoming" : "Outgoing"}
                      </div>
                      <IoOpenOutline
                        className=" ml-2 cursor-pointer text-sm text-neutral-400 transition-colors hover:text-neutral-300"
                        onClick={() => {
                          window.open(
                            Links.scannerUrl({
                              type: "transaction",
                              chainId,
                              hash: transaction.hash,
                            }),
                            "_blank"
                          );
                        }}
                      />
                    </div>
                    <div className="text-xs text-neutral-400">
                      To: {Blockchain.formatEvmAddress(transaction.to || "")}
                    </div>
                  </div>
                </div>
                <div>{transactionValue}</div>
              </div>
            );
          })
        ) : (
          <div>No transactions found</div>
        )}
      </div>
    </div>
  );
};

TransactionsPage.getLayout = (page) => {
  return (
    <BaseLayout>
      <WalletLayout>{page}</WalletLayout>
    </BaseLayout>
  );
};

export default TransactionsPage;

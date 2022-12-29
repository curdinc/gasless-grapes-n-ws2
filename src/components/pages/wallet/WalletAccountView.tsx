import { trpc } from "@utils/trpc";
import { Tab, TabList, TabPanel, useTabState } from "ariakit/tab";
import { TokensView } from "./TokensView";

export default function WalletAccountView() {
  const defaultSelectedId = "default-selected-tab";
  const tab = useTabState({ defaultSelectedId });

  const { data: userWalletDetails } =
    trpc.smartContractWallet.getDefaultWalletDetail.useQuery();
  
  return (
    <>
      <TabList
        state={tab}
        className="flex-row justify-center space-x-10 font-heading text-base"
        aria-label="Groceries"
      >
        <div>
          <Tab className="peer/token" id={defaultSelectedId}>
            Tokens
          </Tab>
          <div
            className="hidden peer-aria-selected/token:mt-2
          peer-aria-selected/token:block peer-aria-selected/token:h-0.5 peer-aria-selected/token:w-full peer-aria-selected/token:rounded-lg peer-aria-selected/token:bg-primary-600"
          />
        </div>
        <div>
          <Tab className="peer/nfts">NFTs</Tab>
          <div className="hidden peer-aria-selected/nfts:mt-2 peer-aria-selected/nfts:block peer-aria-selected/nfts:h-0.5 peer-aria-selected/nfts:w-full peer-aria-selected/nfts:rounded-lg peer-aria-selected/nfts:bg-primary-600"></div>
        </div>
        <div>
          <Tab className="peer/transactions">Transaction</Tab>
          <div className="hidden peer-aria-selected/transactions:mt-2 peer-aria-selected/transactions:block peer-aria-selected/transactions:h-0.5 peer-aria-selected/transactions:w-full peer-aria-selected/transactions:rounded-lg peer-aria-selected/transactions:bg-primary-600"></div>
        </div>
      </TabList>
      <div className="mt-7">
        <TabPanel state={tab} tabId={defaultSelectedId}>
          <TokensView walletAddress={userWalletDetails?.address} />
        </TabPanel>
        <TabPanel state={tab}>
          <ul>
            <li>🥕 Carrot</li>
            <li>🧅 Onion</li>
            <li>🥔 Potato</li>
          </ul>
        </TabPanel>
        <TabPanel state={tab}>
          <ul>
            <li>🥩 Beef</li>
            <li>🍗 Chicken</li>
            <li>🥓 Pork</li>
          </ul>
        </TabPanel>
      </div>
    </>
  );
}

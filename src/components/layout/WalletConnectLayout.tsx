import { Routes } from "@utils/routes";
import type { TabProps, TabStateProps } from "ariakit";
import { Tab, TabList, TabPanel, useTabState } from "ariakit";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export function WalletConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tab = useTabLinkState();
  return (
    <div className="p-10">
      <TabList
        state={tab}
        className="flex-row space-x-5"
        aria-label="Groceries"
      >
        <TabLink className="link" id={Routes.wallet.walletConnect}>
          Active Sessions
        </TabLink>
        <TabLink className="link" id={Routes.wallet.walletConnectToDapp}>
          Connect
        </TabLink>
      </TabList>
      <div className="panels">
        <TabPanel state={tab} tabId={tab.selectedId || undefined}>
          {children}
        </TabPanel>
      </div>
    </div>
  );
}

type TabLinkProps = TabProps<"a"> & { id: string };

export function TabLink(props: TabLinkProps) {
  return <Tab {...props} as={Link} href={props.id} />;
}

export function useTabLinkState(props: TabStateProps = {}) {
  const router = useRouter();
  const { pathname: selectedId } = router;

  const tab = useTabState({
    ...props,
    selectedId,
    setSelectedId: (id) => {
      // setSelectedId may be called more than once for the same id, so we make
      // sure we only navigate once.
      if (id !== selectedId) {
        router.push(id || Routes.wallet.walletConnect);
      }
    },
  });

  return tab;
}

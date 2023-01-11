import type { NextComponentType, NextPageContext } from "next";
import type { AppContextType, AppPropsType } from "next/app";

declare module "next" {
  type NextPage<
    P = Record<string, never>,
    IP = Record<string, never>
  > = NextComponentType<NextPageContext, IP, P> & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}

declare module "next/app" {
  type AppWithLayoutType<P = Record<string, never>> = NextComponentType<
    Omit<AppContextType, "ComponentType"> & { Component: NextPage },
    P,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Omit<AppPropsType<any, P>, "Component"> & { Component: NextPage<any, any> }
  >;
}

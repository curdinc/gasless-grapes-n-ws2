import { trpc } from "@utils/trpc";

export function useUser() {
  const { data, isInitialLoading } = trpc.user.me.useQuery(undefined, {});
  return { user: data, isLoading: isInitialLoading };
}

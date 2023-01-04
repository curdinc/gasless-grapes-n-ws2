import { Button } from "@components/ui/input/Button";
import { Routes } from "@utils/routes";
import { trpc } from "@utils/trpc";
import router from "next/router";
import { IoExitOutline } from "react-icons/io5";

export const LogoutButton = () => {
  const { mutate: logoutUser } = trpc.user.logout.useMutation({
    onSuccess(isLogout) {
      if (isLogout) {
        router.push(Routes.home);
      }
    },
  });
  const logout = async () => {
    logoutUser();
  };
  return (
    <Button className="link mr-3 flex items-center text-sm" onClick={logout}>
      <IoExitOutline className="mr-1 text-lg" /> Log Out
    </Button>
  );
};

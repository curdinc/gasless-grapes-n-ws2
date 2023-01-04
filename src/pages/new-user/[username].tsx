import { RegisterDeviceButton } from "@components/pages/wallet/RegisterDeviceButton";
import { Routes } from "@utils/routes";
import { useUser } from "hooks/useUser";
import { useRouter } from "next/router";

export default function NewUserPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (!isLoading && !user) {
    router.push(Routes.signUp);
  }
  if (user && user.state === "loggedIn") {
    router.push(Routes.wallet);
  }
  if (user && user.state === "pendingAuthentication") {
    router.push(Routes.signIn);
  }

  return (
    <div className={"flex-1 items-center justify-center"}>
      <div className="max-w-md flex-col  rounded-xl  p-14">
        <h1 className="">Activate Your account</h1>
        <p className="mb-8 mt-1 text-sm text-neutral-400">
          Simply register your device within{" "}
          <span className="text-primary-500">10 minutes</span> to activate your
          device and save your handle: {user?.handle}
        </p>
        <RegisterDeviceButton
          isRegisteringNewUser={true}
          onNewUserError={() => {
            router.push(Routes.signUp);
          }}
        />
      </div>
    </div>
  );
}

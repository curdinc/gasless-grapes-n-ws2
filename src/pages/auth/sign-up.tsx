import { ChooseUsername } from "@components/pages/auth/ChooseUsername";
import { Routes } from "@utils/routes";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className={"flex h-full flex-1 items-center justify-center"}>
      <div className="flex max-w-md flex-col p-14">
        <h1 className="pb-5 text-sm">Create a new account </h1>

        <ChooseUsername />
        <p className="pt-2 text-sm text-neutral-400">
          Already have an account?{" "}
          <Link className="link" href={Routes.signIn}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

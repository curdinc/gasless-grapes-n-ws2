import { SignUpForm } from "@components/pages/auth/SignUpForm";
import { Routes } from "@utils/routes";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className={"flex h-full flex-1 items-center justify-center"}>
      <div className="flex max-w-md flex-col p-14">
        <h1 className="">Create a new account </h1>
        <p className="mb-5 py-1 text-sm text-neutral-400">
          Register your device to begin
        </p>

        <SignUpForm />
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

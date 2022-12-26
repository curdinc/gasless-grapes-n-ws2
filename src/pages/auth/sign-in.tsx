import { Button } from "@components/input/Button";
import { Routes } from "@utils/routes";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignIn() {
  const { error, callbackUrl } = useRouter().query;

  return (
    <div className={"flex flex-1 items-center justify-center"}>
      <div className="flex max-w-md flex-col  rounded-xl  p-14">
        <h1 className="font-heading text-4xl">Sign In </h1>
        <p className="mb-5 py-1 text-sm text-neutral-400">
          Verify your device to continue
        </p>
        <Button className="btn w-full" onClick={() => console.log("test")}>
          Sign In
        </Button>
        <p className="pt-2 text-sm text-neutral-400">
          Already have an account?{" "}
          <Link className="link" href={Routes.signUp}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

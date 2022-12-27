import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { EmailForm } from "@components/pages/home/EmailForm";
import { trpc } from "@utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gasless Grapes</title>
        <meta
          name="description"
          content="Home of the world's first gasless wallet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={"mx-auto max-w-lg p-5"}>
          <h1
            className={"font-heading text-4xl font-extrabold text-primary-300"}
          >
            The hardware wallet you already have.
          </h1>
          <p className="text-md py-2 text-opacity-70">
            Say goodbye to seed phrases and gas fees.
          </p>
          <EmailForm />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className={"p-5"}>
      <p className={"p-5"}>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className={"p-5"}
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

import { BaseLayout } from "@components/layout/BaseLayout";
import { Testimonial } from "@components/pages/home/Testimonial";
import { Button } from "@components/ui/input/Button";
import { Routes } from "@utils/routes";
import type { NextPage } from "next";
import Image from "next/image";
import router from "next/router";
import { IoLogoTwitter } from "react-icons/io5";

import GaslessGrapeWalletPicture from "../../public/grape_wallet.webp";

const Home: NextPage = () => {
  return (
    <>
      <main className="flex flex-col items-center p-9">
        <section className="grid grid-cols-1 place-items-center md:grid-cols-2">
          <div className="py-10 md:max-w-2xl">
            <h2 className="text-bold font-heading text-6xl ">
              Trade DeFi, Mint NFTs,
            </h2>
            <h2 className="text-bold font-heading text-6xl md:mt-2">
              All for Free
            </h2>
            <p className="mt-2 text-neutral-400 md:mt-4">
              The crypto wallet on the Goerli blockchain with no gas fees
              (mainnet coming soon)
            </p>
            <Button
              className="btn hidden  w-fit px-7 py-2 text-lg md:mt-6 md:block"
              onClick={() => {
                router.push(Routes.wallet.home);
              }}
            >
              I want to stop paying gas fees
            </Button>
          </div>
          <div className="px-10 md:max-w-xl">
            <Image src={GaslessGrapeWalletPicture} alt="Grape Wallet" />
          </div>
        </section>
        <Button
          className="btn px-5 py-2 text-lg md:hidden"
          onClick={() => {
            router.push(Routes.wallet.home);
          }}
        >
          I want to stop paying gas fees
        </Button>
        <section className="flex w-full flex-col items-start py-10 md:items-center">
          <div className="font-heading text-2xl md:text-4xl">
            Why Use Gasless Grapes?
          </div>
          <ul className="space-y-6 p-6 md:mt-4 md:grid md:max-w-4xl md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0 md:p-10">
            <li>
              <div className="text-bold text-xl">Pay less gas fees</div>
              <div className="mt-2 text-sm text-neutral-400 md:text-base">
                Like literally 0 gas fees
              </div>
            </li>
            <li>
              <div className="text-bold text-xl">
                Never Lose Access To Your Wallet
              </div>
              <div className="mt-2 text-sm text-neutral-400 md:text-base">
                Biometric login means you never have to remember gibberish
                private keys &quot;fh092783gfcb2gc08G)*GFD^#B@#G&quot;
              </div>
            </li>
            <li>
              <div className="text-bold text-xl">
                Invest With One Click (Coming Soon)
              </div>
              <div className="mt-2 text-sm text-neutral-400 md:text-base">
                Complex loops, and leveraged yield farms? Tell us the steps, and
                we will save it all into one-click
              </div>
            </li>
            <li>
              <div className="text-bold text-xl">
                Protect your assets (Coming Soon)
              </div>
              <div className="mt-2 text-sm text-neutral-400 md:text-base">
                We simulate your transactions and signature to make sure you
                aren&apos;t signing away your crypto fortune
              </div>
            </li>
          </ul>
        </section>
        <section className="flex flex-col items-center">
          <h2 className="text-bold font-heading text-2xl md:text-4xl">
            See what other&apos;s are saying
          </h2>
          <div className="space-y-3 py-5 md:mt-4 md:grid md:max-w-4xl md:grid-cols-3 md:gap-1 md:space-y-0">
            <Testimonial
              testimonial="Can't wait to try out your wallet when it's
                      out!🔥"
              handle="@emanperez28"
              name="Emanuel Perez"
              date="5th Jan 23"
            />
            <Testimonial
              name="nicnode.lens"
              handle="@nicnode"
              testimonial="I've always found p annoying the way you have to
                      connect/disconnect accounts on MM."
              date="4th Jan 23"
            />
            <Testimonial
              name="F3 XpsPro Gamer"
              handle="@xpsprogamer"
              testimonial="🔥"
              date=" 3 days ago"
            />
            <Testimonial
              name="FKarolis"
              handle="@karooolis"
              testimonial="Banger idea, just what web3 needs 💯 lots of questions about the implementation, would be super keen to try out the final product!"
              date=" 20th Dec 22"
            />
            <Testimonial
              name="Dunk"
              handle="@xpsprogamer"
              testimonial="nice idea guys"
              date=" 21st Dec 22"
            />
            <Testimonial
              name="Steve Han"
              handle="@TheSteveHan"
              testimonial="This kind of sounds too good to be true? What's the catch?"
              date=" 20th Dec 22"
            />
            <Testimonial
              name="harpaljadeja.eth / .lens 💚"
              handle="@HarpalJadeja11"
              testimonial="Ambitious"
              date=" 21st Dec 22"
            />
            <Testimonial
              name="rbank.eth 🤖"
              handle="@Web3blackguy"
              testimonial="I like this a lot - simple, concise idea that addresses major pain points. The name made me raise an eyebrow, but with the right branding that may not be a bad thing.."
              date=" 21st Dec 22"
            />
          </div>
        </section>
        <Button
          className="btn mt-10 mb-5 px-7 py-2 text-base md:text-lg"
          onClick={() => {
            router.push(Routes.wallet.home);
          }}
        >
          I want to the best wallet experience
        </Button>
      </main>
      <footer className="flex w-full flex-row justify-center bg-neutral-800 py-6">
        <IoLogoTwitter
          onClick={() => {
            window.open("https://twitter.com/GaslessGrapes/", "_blank");
          }}
          className="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-300"
        />
      </footer>
    </>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Home;

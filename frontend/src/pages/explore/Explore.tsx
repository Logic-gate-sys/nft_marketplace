import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../assets/main_background.svg";
import Todo from "../../assets/todo.svg";
import { CollectionsCarousel } from "../../components/carousel/ColCarousel";

interface OnboardingStep {
  title: string;
  image: string;
  description: string;
}

const Home: React.FC = () => {

  // handling seach
  const handleSearch = async () => {
    console.log("Searching hanlder ")
  }
  return (
    <div id="home-page" className="flex flex-col h-full gap-5 p-3">
      <section>
        <CollectionsCarousel collections={collections} />
      </section>

      <h1 className="text-3xl font-extrabold">How It Works</h1>

      {/* Onboarding Steps */}
      <div id="how-it-work" className="flex flex-wrap gap-5 m-auto">
        {onboardingSteps.map((step, index) => (
          <div
            key={index}
            className="box-border flex flex-col items-center gap-1 p-2 m-auto bg-gray-900 rounded md:h-50 md:w-65 shadow-3xl hover:scale-99"
          >
            <img src={step.image} height={40} width={40} />
            <h2 className="text-2xl font-extrabold text-center text-wrap">
              {step.title}
            </h2>
            <p className="text-center text-wrap">{step.description}</p>
          </div>
        ))}
        <Link to="/nft-market">
          <button className="self-end border-none outline-none bg-[#DC3546] h-10 pl-2 pr-2 rounded-sm w-max text-end font-bold active:scale-95">
            GET STARTED
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

// -------------------------- Sample Data ----------------------------
const onboardingSteps: OnboardingStep[] = [
  {
    title: "Setup Your Wallet",
    image: Todo,
    description:
      "Set up your wallet of choice. Connect it to the Animarket by clicking the wallet icon in the top right corner.",
  },
  {
    title: "Create Collection",
    image: Todo,
    description:
      "Upload your work and setup your collection. Add a description, social links and floor price.",
  },
  {
    title: "Start Earning",
    image: Todo,
    description:
      "Choose between auctions and fixed-price listings. Start earning by selling your NFTs or trading others.",
  },
];
// ------------------------------- Sample Data ----------------------------------------------

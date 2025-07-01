import Login from '../assets/main_background.svg';
import Todo from '../assets/todo.svg'



const onboardingSteps = [
  {
    title: "Setup Your Wallet",
    image:Todo, // replace with actual path or URL
    description: "Set up your wallet of choice. Connect it to the Animarket by clicking the wallet icon in the top right corner."
  },
  {
    title: "Create Collection",
    image: Todo, // replace with actual path or URL
    description: "Upload your work and setup your collection. Add a description, social links and floor price."
  },
  {
    title: "Start Earning",
    image: Todo, // replace with actual path or URL
    description: "Choose between auctions and fixed-price listings. Start earning by selling your NFTs or trading others."
  }
];

const Home = () => {
    return (
        <div id='home-page' className="flex flex-col gap-5  p-3 h-full">
            <div id="hero-container" className="bg-[url('/home/logic/nft_marketplace/frontend/src/assets/main_background.svg')]
             z-0 bg-no-repeat bg-cover h-84 flex flex-col justify-center">
                <div id="hero-text" className='flex flex-col justify-center'>
                    <h1 className='m-auto text-center bg-gradient-to-r from-[#5C3EAF] to-[#D279F5] bg-clip-text text-transparent
                 text-3xl font-extrabold z-10'>BUY AND SELL YOUR DESINGS WITH EASE </h1>
                    <p className='text-center'>
                        Not an artist? No problem. With Mint-Muse, you can mint and sell your creations—art, designs,
                        anything—without needing to be a pro. Just sign up, connect your wallet, and start for free.
                    </p>
                </div>
            </div>
            <h1 className='text-3xl font-extrabold'>How It Works </h1>
            <div id="how-it-work" className='m-auto flex flex-wrap gap-5'>
                {onboardingSteps.map((step,index) => (
                    <div  key={index} className=' bg-gray-900  md:h-50 md:w-65  m-auto rounded shadow-3xl box-border p-2 flex flex-col items-center gap-1'>
                        <img src={step.image} height={50}  width={50} className=''/>
                        <h2 className='text-center text-2xl font-extrabold text-wrap'>{step.title}</h2>
                        <p className='text-center text-wrap'>{step.description}</p>
                    </div>
                ))}
                <button className='self-end border-none outline-none bg-[#DC3546] h-10 pl-2 pr-2 rounded-sm w-max text-end font-bold active:scale-95'> GET STARTED</button>
            </div>
        </div>
    )
}

export default Home;
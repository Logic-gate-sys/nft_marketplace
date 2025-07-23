import { useParams,Link } from "react-router-dom";
import detailImage from '../assets/sample_detail.png';
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import nft_image from '../assets/nft-image.png';


const nftItems = [
  {
    id: 1,
    title: "Liquid Wave",
    image: nft_image,
    author: "Anthoine Lutherodt",
    description: "A flowing abstract piece symbolizing motion and fluidity.",
    auctionTime: "3h 1m 50s",
    currentBid: "0.05 ETH",
    highestBid: "0.15 ETH",
  },
  {
    id: 2,
    title: "Crimson Echo",
    image: nft_image,
    author: "Selorm Tetteh",
    description: "Bold red tones echoing energy and power.",
    auctionTime: "2h 45m 30s",
    currentBid: "0.08 ETH",
    highestBid: "0.20 ETH",
  },
  {
    id: 3,
    title: "Neon Pulse",
    image: nft_image,
    author: "Adwoa Nkrumah",
    description: "Vibrant neon lines capturing the rhythm of light.",
    auctionTime: "1h 15m 10s",
    currentBid: "0.02 ETH",
    highestBid: "0.10 ETH",
  },
  {
    id: 4,
    title: "Dark Matter",
    image: nft_image,
    author: "Kwesi Boakye",
    description: "A cosmic visual inspired by space and shadows.",
    auctionTime: "5h 22m 5s",
    currentBid: "0.1 ETH",
    highestBid: "0.25 ETH",
  },
  {
    id: 5,
    title: "Cyber Bloom",
    image: nft_image,
    author: "Esi Hammond",
    description: "A futuristic floral design blending tech and nature.",
    auctionTime: "4h 10m 40s",
    currentBid: "0.07 ETH",
    highestBid: "0.17 ETH",
  },
  {
    id: 6,
    title: "Fractal Dust",
    image: nft_image,
    author: "Yaw Mensah",
    description: "Digital dust patterns forming infinite fractals.",
    auctionTime: "6h 5m 20s",
    currentBid: "0.03 ETH",
    highestBid: "0.09 ETH",
  },
  {
    id: 7,
    title: "Lucid Dream",
    image: nft_image,
    author: "Akua Owusu",
    description: "A dreamy, surreal landscape evoking imagination.",
    auctionTime: "0h 59m 59s",
    currentBid: "0.12 ETH",
    highestBid: "0.22 ETH",
  },
  {
    id: 8,
    title: "Binary Soul",
    image: nft_image,
    author: "Kojo Bruce",
    description: "Explores human emotion in binary code form.",
    auctionTime: "7h 30m 15s",
    currentBid: "0.09 ETH",
    highestBid: "0.18 ETH",
  },
  {
    id: 9,
    title: "Mystic Code",
    image: nft_image,
    author: "Ama Dufie",
    description: "Ancient symbols encrypted in digital light.",
    auctionTime: "8h 44m 2s",
    currentBid: "0.04 ETH",
    highestBid: "0.14 ETH",
  },
  {
    id: 10,
    title: "Glow Circuit",
    image: nft_image,
    author: "Nana Quaye",
    description: "A glowing schematic of a digital universe.",
    auctionTime: "1h 25m 30s",
    currentBid: "0.06 ETH",
    highestBid: "0.16 ETH",
  }
];

const NFTDetails = () => {
  const { id } = useParams();
    const Item = nftItems.find((item) => item.id === Number(id));
    

  if (!Item) {
    return (
      <div className="m-auto text-4xl font-extrabold text-red-700">
        <h1>ERROR! <span>No details found for element</span></h1>
      </div>
    );
  }
  const { title, image,author, description } = Item;
    return (
    <div id="detail-container" className="flex flex-col items-center justify-center">
    <div className="grid grid-cols-2">
        <div id="image-of-nft">
              <img src={image}  alt="NFT detail image" />
        </div>
        <div id="card-with-details" className="text-white bg-[#6C7AA0] shadow-3xl rounded-sm flex flex-col justify-center p-5 items-start">
          <div id="creator-info" className="flex items-center gap-2 text-2xl text-blue-900 font-extrabold">
            <Avatar size="large" icon={<UserOutlined className="" />} />
           <h4>{author}</h4>
          </div>
          <div id="art-info" className="mb-2 flex flex-col gap-4">
            <span className=" text-3xl font-bold">{title}</span>
            <span className="text-xl font-semibold">{description}</span>
          </div>
          <button className="bg-[#6F4FF2] rounded-lg w-36 p-1 pl-2 pr-2 font-semibold active:scale-95">Buy</button>
        </div>
            </div>
            <h1 className="font-bold text-2xl p-2">Similar NFT Arts</h1>
            <div id="collections" className="overflow-y-auto flex flex-wrap gap-4 h-[510px] scrollbar-hide ">
                {nftItems?.map((item) => (
                    <div id="card" key={item.id} className="bg-[#6C7AA0] w-max rounded-lg shadow-2xl flex flex-col p-1">
                <div id="image-title" key={item.id} className="flex flex-col">
                            <img src={item.image} alt="nft image" height={50} width={180}/> 
                        <h1 className="font-extrabold text-1xl ">{item.title}</h1>  
                        </div>
                    <div id="autions" className="grid grid-cols-2 gap-2">
                            <div id="aution-time" className="flex flex-col">
                                <h2 className="font-semibold">Aution Time</h2>
                                <h2>{item.auctionTime}</h2>
                           </div>
                            <div id="aution-bid" className="flex flex-col">
                                <h2 className="font-semibold">Current Bid</h2>
                                <h2>{item.currentBid}</h2>
                                <h2>{item.highestBid}</h2>
                           </div> 
                        </div>
                        <div id="call-to-action-btn" className="flex p-1">
                            <button className="mr-auto bg-[#6F4FF2] rounded-lg w-max p-1 pl-4 pr-4" >Buy</button>
                            <Link to={`/nft-details/${item.id}`} key={item.id}><button className="bg-[#DC3546] rounded-lg w-max p-1 pl-4 pr-4">Details</button></Link>
                     </div>   
                  </div>
            ))
                }
                </div>
    </div>
  );
};

export default NFTDetails;

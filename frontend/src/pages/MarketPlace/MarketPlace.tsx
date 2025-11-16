import { Link } from "react-router-dom";
import nft_image from '../../assets/nft-image.png';
interface NFTItem {
  id: number;
  title: string;
  image: string;
  auctionTime: string;
  currentBid: string;
  highestBid: string;
}


const nftItems: NFTItem[] = [
  {
    id: 1,
    title: "Liquid Wave",
    image: nft_image,
    auctionTime: "3h 1m 50s",
    currentBid: "0.05 ETH",
    highestBid: "0.15 ETH",
  },
  {
    id: 2,
    title: "Crimson Echo",
    image: nft_image,
    auctionTime: "2h 45m 30s",
    currentBid: "0.08 ETH",
    highestBid: "0.20 ETH",
  },
  {
    id: 3,
    title: "Neon Pulse",
    image: nft_image,
    auctionTime: "1h 15m 10s",
    currentBid: "0.02 ETH",
    highestBid: "0.10 ETH",
  },
  {
    id: 4,
    title: "Dark Matter",
    image: nft_image,
    auctionTime: "5h 22m 5s",
    currentBid: "0.1 ETH",
    highestBid: "0.25 ETH",
  },
  {
    id: 5,
    title: "Cyber Bloom",
    image: nft_image,
    auctionTime: "4h 10m 40s",
    currentBid: "0.07 ETH",
    highestBid: "0.17 ETH",
  },
  {
    id: 6,
    title: "Fractal Dust",
    image: nft_image,
    auctionTime: "6h 5m 20s",
    currentBid: "0.03 ETH",
    highestBid: "0.09 ETH",
  },
  {
    id: 7,
    title: "Lucid Dream",
    image: nft_image,
    auctionTime: "0h 59m 59s",
    currentBid: "0.12 ETH",
    highestBid: "0.22 ETH",
  },
  {
    id: 8,
    title: "Binary Soul",
    image: nft_image,
    auctionTime: "7h 30m 15s",
    currentBid: "0.09 ETH",
    highestBid: "0.18 ETH",
  },
  {
    id: 9,
    title: "Mystic Code",
    image: nft_image,
    auctionTime: "8h 44m 2s",
    currentBid: "0.04 ETH",
    highestBid: "0.14 ETH",
  },
  {
    id: 10,
    title: "Glow Circuit",
    image: nft_image,
    auctionTime: "1h 25m 30s",
    currentBid: "0.06 ETH",
    highestBid: "0.16 ETH",
  },
];

const MarketPlace: React.FC = () => {
  return (
    <div id="text-white" className="flex flex-col gap-0">
      {/* Categories */}
      <div id="listings" className="pb-2">
        <div
          id="arts-categories"
          className="flex flex-wrap gap-2 p-1 m-auto text-xs font-semibold"
        >
          <button className="p-2 bg-gray-600 rounded-sm w-max">All</button>
          <button className="p-1 bg-gray-300 rounded-lg w-max">Gaming</button>
          <button className="p-1 bg-gray-600 rounded-lg w-max">Arts</button>
          <button className="p-1 bg-gray-600 rounded-lg w-max">PPFs</button>
          <button className="p-1 bg-gray-600 rounded-lg w-max">Photography</button>
        </div>
      </div>

      {/* NFT Cards */}
      <div id="collections-container" className="m-auto">
        <div id="collections" className="flex flex-wrap gap-4 scrollbar-hide">
          {nftItems.map((item: NFTItem) => (
            <div
              id="card"
              key={item.id}
              className="bg-[#6C7AA0] w-max rounded-lg shadow-2xl flex flex-col p-1"
            >
              <div id="image-title" className="flex flex-col">
                <img
                  src={item.image}
                  alt={item.title}
                  height={50}
                  width={180}
                />
                <h1 className="font-extrabold text-1xl">{item.title}</h1>
              </div>

              <div id="autions" className="grid grid-cols-2 gap-2">
                <div id="aution-time" className="flex flex-col">
                  <h2 className="font-semibold">Auction Time</h2>
                  <h2>{item.auctionTime}</h2>
                </div>
                <div id="aution-bid" className="flex flex-col">
                  <h2 className="font-semibold">Current Bid</h2>
                  <h2>{item.currentBid}</h2>
                  <h2>{item.highestBid}</h2>
                </div>
              </div>

              <div id="call-to-action-btn" className="flex p-1">
                <button className="mr-auto bg-[#6F4FF2] rounded-lg w-max p-1 pl-4 pr-4">
                  Buy
                </button>
                <Link to={`/nft-details/${item.id}`}>
                  <button className="bg-[#DC3546] rounded-lg w-max p-1 pl-4 pr-4">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;

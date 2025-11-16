import React from "react";
import { Link } from "react-router-dom";

// Define the structure of a single NFT
interface NFT {
  id: number;
  title: string;
  image: string;
  auctionTime: string;
  currentBid: string;
  highestBid: string;
}

// Props for the card component
interface NFTCardProps {
  item?: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ item }) => {
  return (
    <div className="bg-[#6C7AA0] w-max rounded-lg shadow-2xl flex flex-col p-1">
      <div className="flex flex-col">
        <img src={item?.image} alt={item?.title} height={50} width={180} />
        <h1 className="font-extrabold">{item?.title}</h1>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <h2 className="font-semibold">Auction Time</h2>
          <span>{item?.auctionTime}</span>
        </div>
        <div className="flex flex-col">
          <h2 className="font-semibold">Current Bid</h2>
          <span>{item?.currentBid}</span>
          <span>{item?.highestBid}</span>
        </div>
      </div>

      <div className="flex p-1">
        <button className="mr-auto bg-[#6F4FF2] rounded-lg w-max p-1 pl-4 pr-4 hover:scale-95 transition">
          Buy
        </button>
        <Link to={`/nft-details/${item?.id}`}>
          <button className="bg-[#DC3546] rounded-lg w-max p-1 pl-4 pr-4 hover:scale-95 transition">
            Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NFTCard;

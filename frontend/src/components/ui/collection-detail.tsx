import React from "react";

interface CollectionDetailCardProps {
  name: string;
  type: string;
  banner: string;
  logo: string;
  description: string;
  floorPrice: string;
  volume: string;
  owners: string;
  items: string;
}

const CollectionDetailCard: React.FC<CollectionDetailCardProps> = ({
  name,
  type,
  banner,
  logo,
  description,
  floorPrice,
  volume,
  owners,
  items,
}) => {
  return (
    <div className="w-full bg-black  shadow-lg rounded-2xl overflow-hidden">
      {/* Banner */}
      <div className="relative">
        <img
          src={banner}
          alt={`${name} banner`}
          className="w-full h-40 object-cover"
        />
        <div className="absolute -bottom-10 left-6">
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-20 h-20 rounded-xl border-4 border-white shadow-md object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="pt-14 px-6 pb-6">
        <section className="flex">
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <h2 className="ml-auto text-zinc-600 text-lg font-bold mb-2"> {type}</h2>
        </section>
        <p className="text-gray-60 opacity-60 text-sm mb-4">{description}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-bold">{floorPrice} ETH</p>
            <p className="text-gray-500 text-xs">Floor</p>
          </div>
          <div>
            <p className="font-bold">{volume} ETH</p>
            <p className="text-gray-500 text-xs">Volume</p>
          </div>
          <div>
            <p className="font-bold">{owners}</p>
            <p className="text-gray-500 text-xs">Owners</p>
          </div>
          <div>
            <p className="font-bold">{items}</p>
            <p className="text-gray-500 text-xs">Items</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CollectionDetailCard;

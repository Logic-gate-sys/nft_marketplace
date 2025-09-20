import React, { useState } from "react";

interface nftProp {
  tokenId: number;
  image: string;
  name: string;
  collectionName: string;
  setWantsToList : (val: boolean) => void
}

export default function NFTCard({
  image,
  name,
  collectionName,
  tokenId,
  setWantsToList
}: nftProp) {
  
 
  

  return (
    <article className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-800/60">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* Meta */}
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">
          {name} #{tokenId}
        </h3>
        <p className="text-xs text-zinc-400">{collectionName} </p>
        <div className=" flex justify-center, items-center">
          <button
            onClick={() => setWantsToList(true)}
            className="bg-blue-500 px-5 py-1 rounded-lg font-semi-bold hover:bg-orange-500 self-center"
          >
            List
          </button>
        </div>
        {/* <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{nft.priceEth} ETH</span>
          <span className="text-xs text-zinc-400">❤️ {nft.likes}</span>
        </div> */}
      </div>
    </article> 
  );
}

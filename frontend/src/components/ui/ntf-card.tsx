import React from "react";

export default function NFTCard() {
  const nft = {
    nft_id: "1",
    name: "Yachtman #24",
    image: "https://picsum.photos/400?random=1",
    collectionName: "Yacht City",
    collectionVerified: true,
    priceEth: 0.42,
    chain: "ethereum",
    likes: 123,
    onSale: true,
  };

  return (
    <article
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-800/60">
        <img
          src={nft.image}
          alt={nft.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Meta */}
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">{nft.name}</h3>
        <p className="text-xs text-zinc-400">{nft.collectionName} </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">{nft.priceEth} ETH</span>
          <span className="text-xs text-zinc-400">❤️ {nft.likes}</span>
        </div>
      </div>
    </article>
  );
}

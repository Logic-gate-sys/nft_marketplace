import React from "react";

export default function CollectionCard() {
  const collection = {
    col_id: "1",
    name: "Yacht City",
    avatar: "https://picsum.photos/200?random=2",
    banner: "https://picsum.photos/600/200?random=3",
    floorPrice: 0.2,
    volume: 320,
    items: 5000,
    owners: 1800,
    description: "The legendary Yacht City collection.",
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-zinc-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all">
      {/* Banner */}
      <div className="relative h-28 w-full bg-zinc-800/60">
        <img src={collection.banner} alt="" className="h-full w-full object-cover" />
        <div className="absolute -bottom-8 left-4 h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-zinc-900">
          <img src={collection.avatar} alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-10">
        <h3 className="text-base font-semibold text-white">{collection.name} </h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{collection.description}</p>
        <div className="mt-4 grid grid-cols-4 gap-3 text-center text-xs text-zinc-400">
          <div>
            <p className="uppercase">Floor</p>
            <p className="font-semibold text-white">{collection.floorPrice} ETH</p>
          </div>
          <div>
            <p className="uppercase">Volume</p>
            <p className="font-semibold text-white">{collection.volume} ETH</p>
          </div>
          <div>
            <p className="uppercase">Items</p>
            <p className="font-semibold text-white">{collection.items}</p>
          </div>
          <div>
            <p className="uppercase">Owners</p>
            <p className="font-semibold text-white">{collection.owners}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

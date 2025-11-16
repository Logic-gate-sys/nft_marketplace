import React from "react";

export default function NFTDetail() {
  const nft = {
    name: "Yachtman #24",
    image: "https://picsum.photos/600?random=4",
    collectionName: "Yacht City",
    description: "A brave Yachtman who defied the storm predictions.",
    traits: [
      { type: "Background", value: "Ocean Blue" },
      { type: "Hat", value: "Captain Cap" },
      { type: "Mood", value: "Confident" },
    ],
    priceEth: 0.42,
    lastSaleEth: 0.3,
  };

  return (
    <section className="grid grid-cols-1 gap-6 rounded-3xl bg-zinc-900 p-4 ring-1 ring-zinc-800 md:grid-cols-2 lg:p-6">
      <div className="overflow-hidden rounded-2xl bg-zinc-800/60">
        <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white">{nft.name}</h1>
        <p className="text-sm text-zinc-400">{nft.collectionName} ✅</p>

        <div className="mt-4 rounded-xl bg-zinc-800/60 p-4">
          <p className="text-xs text-zinc-400">Current Price</p>
          <p className="text-2xl font-semibold text-white">{nft.priceEth} ETH</p>
          <p className="mt-1 text-xs text-zinc-400">Last Sale: {nft.lastSaleEth} ETH</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Buy Now
            </button>
            <button className="rounded-xl bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-600">
              Make Offer
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold text-white">Traits</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {nft.traits.map((t, i) => (
              <div key={i} className="rounded-xl bg-zinc-800/60 p-3">
                <p className="text-[11px] uppercase text-zinc-400">{t.type}</p>
                <p className="text-sm font-semibold text-white">{t.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

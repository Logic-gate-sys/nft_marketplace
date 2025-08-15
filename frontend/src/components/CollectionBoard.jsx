import React, { useState } from "react";
import CollectionInfoCard from "./CollectionDetailCard.jsx";
import CollectionListCard from "./CollectionCard.jsx";
import NFTCard from "./NFTCard.jsx";
import { MintForm } from "./MintForm.jsx";




const CollectionBoard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCollection = collections[selectedIndex] || null;
  const [wantsToMint, setWantsToMint] = useState(false);
  // use effect to fetch all collections so that I can set the selected collection

  // handle minting 
  const handleMint = async () => {
    setWantsToMint(val=> !val);
    // get signer : address 
    // fetch collection and derived the col_id
    // 
  }

  return (
    <>
    <div
      id="col-card"
      className="grid grid-cols-[1.3fr_4fr] opacity-55 min-h-screen text-white"
    >
      <CollectionListCard
        collections={collections}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      <div className="p-4 flex flex-col gap-4">
        <CollectionInfoCard collection={selectedCollection} />

        <div id="nfts-in-collection" className="grid grid-cols-3 gap-4 mb-4">
          {selectedCollection && selectedCollection.nfts.length > 0 ? (
            selectedCollection.nfts.map((nft, i) => (
              <NFTCard key={i} nft={nft} />
            ))
          ) : (
            <p className="col-span-3 text-gray-400">
              No NFTs in this collection
            </p>
          )}
        </div>

        {selectedCollection && (
          <div id="mint-btn">
            <button onClick={ handleMint} className="bg-purple-600 hover:bg-purple-500 p-2 rounded">
              Mint NFT
            </button>
          </div>
        )}
      </div>
      </div>
      {wantsToMint && <MintForm setWantsToMint={setWantsToMint} col_id={5}  />}
      </>
  );
};

export default CollectionBoard;








//------------- helper function components ----------------------

const collections = [
  {
    name: "Cool Cats",
    description: "A collection of cool cat NFTs",
    nfts: [
      { name: "Cool Cats", id: 1, price: "0.05 ETH", owner: "0x123..." },
      { name: "Cool Cats", id: 2, price: "0.08 ETH", owner: "0x123..." },
    ],
  },
  {
    name: "CryptoPunks",
    description: "OG pixel NFT collection",
    nfts: [{ name: "CryptoPunks", id: 1, price: "50 ETH", owner: "0x456..." }],
  },
];




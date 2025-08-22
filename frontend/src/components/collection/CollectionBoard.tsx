import React, { useState, useEffect } from "react";
import { CollectionCard } from "../effect/helperComponents"; // assuming it's TS-ready
import CollectionListCard from "./CollectionCard";
import NFTCard from "../nft/NFTCard";
import { MintForm } from "../form/MintForm";
import { fetchPinataMetaData } from "../../ether/helperFunction";
import axios from "axios";
import { connectWallet, fetchUserId } from "../../ether/wallet_interactions";

// --------- Interfaces for types -----------------
interface NFT {
  id: string;
  name: string;
  image_uri: string;
  price: string;
  owner: string;
}

interface Collection {
  id: string;
  col_uri: string;
  metadata?: {
    name: string;
    description?: string;
    [key: string]: any;
  };
}

interface CollectionBoardProps {
  userId: string;
}

const CollectionBoard: React.FC<CollectionBoardProps> = ({ userId }) => {
  // nfts for each collection
  const [nftsInCol, setNftsInCol] = useState<NFT[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [wantsToMint, setWantsToMint] = useState<boolean>(false);
  const [fetchingCols, setFetchingCols] = useState<boolean>(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const selectedCollection = collections[selectedIndex];

  // fetch all collections for user
  useEffect(() => {
    setFetchingCols(true);
    console.log("THIS USER'S ID: ", userId);
    getCollection(userId);
  }, [userId]);

  // handle selected index
  const onSelect = (index: number, col_id: string) => {
    setSelectedIndex(index);
    console.log("Selected: ", index);
    setSelectedCollectionId(col_id);
    console.log("SELECTED COLLECTION ID : ", col_id);
  };

  // handle minting
  const handleMint = async () => {
    setWantsToMint((val) => !val);
    if (!userId) {
      const { wallet } = await connectWallet();
      const newUserId = await fetchUserId(wallet);
      // Ideally update state instead of overwriting prop
      console.log("Fetched user ID from wallet: ", newUserId);
    }
    const col_id = selectedCollectionId || "0";
    console.log("Minting to collection: ", col_id);
  };

  // get the collections
  const getCollection = async (id: string) => {
    try {
      const response = await axios.get<Collection[]>(
        `http://localhost:3000/api/collections/user/${id}`
      );
      console.log("RAW COLLECTION RESPONSE:", response.data);

      const col_raw = response.data;
      const refine_col_metadata = await Promise.all(
        col_raw.map(async (col) => {
          const metadata = await fetchPinataMetaData(col.col_uri);
          return { ...col, metadata };
        })
      );
      console.log("REFINED COLLECTION METADATA:", refine_col_metadata);
      setCollections(refine_col_metadata);
    } catch (err) {
      console.log("ERROR: ", err);
    } finally {
      setFetchingCols(false);
    }
  };

  return (
    <div>
      <div id="main-container" className="m-auto grid grid-cols-[2fr_4fr] gap-4 md:px-20 py-4">
        <div id="col_card">
          <CollectionListCard
            collections={collections}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
          />
        </div>
        <div id="detail_and_nfts" className="flex flex-col gap-4 ">
          {/* Assuming CollectionInfoCard is a component you have */}
          {/* <CollectionInfoCard selectedCollection={selectedCollection} /> */}

          <div>
            <NFTCard nfts={nftsInCol} />
            <MintForm
              col_id={selectedCollectionId || ""}
              col_name={selectedCollection?.metadata?.name || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionBoard;

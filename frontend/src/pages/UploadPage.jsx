import { useState, useEffect } from "react";
import axios from "axios";
import { fetchPinataMetaData } from "../ether/helperFunction.js";
import { createCollection, mintNFT } from "../ether/contract_interaction.js";


import CollectionBoard from "../components/CollectionBoard.jsx";





const UploadPage = ({ id }) => {
  
  //-------- collections fetching  ---------------------
  const [nfts, setnfts] = useState([]);
  const [fetchingCols, setFetchingCols] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  //specific collections that user has
  const [collection, setCollection] = useState({}); // a mapping of user collection to nfts in colletion


  //------------------- useEffects -------------------------------------------
  // useEffect(() => {
  //   const getCollection = async () => {
  //     // set loader for data fetching
  //     setFetchingCols(true);
  //     if (id) {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:3000/api/nfts/users/${id}`
  //         );
  //         const nft_raw = response.data;

  //         const withMetadata = await Promise.all(
  //           nft_raw.map(async (nft) => {
  //             const metadata = await fetchPinataMetaData(nft.ipfs_url);
  //             return { ...nft, metadata };
  //           })
  //         );
  //         setnfts(withMetadata);
  //         setSelectedNFT(withMetadata[1]);
  //         //stop fetching loader
  //         console.log("WITH METADATA: ", withMetadata);
  //         console.log("Collections ", nfts);
  //         setFetchingCols(false);
  //       } catch (err) {
  //         console.error("Failed to fetch collections:", err);
  //       }
  //     }
  //   };
  //   getCollection();
  // }, [id]);



  return (
    <>
      <div id="upload-page" className="flex flex-col p-6 gap-8">
        <div id="word-of-page" className="self-center">
          <h1 className="text-center text-3xl font-bold text-purple-400">
            {" "}
            MANAGE YOUR COLLECTIONS{" "}
          </h1>
          <section className="text-2xl ">
            Store unique collectible characters with proof of ownership backed
            by{" "}
            <span className="text-purple-800 text-2xl font-bold">Danno's</span>{" "}
            ERC7-721 smart contracts
          </section>
        </div>
        <div id="collection-board">
          <CollectionBoard />
        </div>
      </div>
    </>
  );
};

export default UploadPage;

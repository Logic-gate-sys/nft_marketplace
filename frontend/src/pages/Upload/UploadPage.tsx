import { useState, useEffect } from "react";
import axios from "axios";
import { fetchPinataMetaData } from "../../ether/helperFunction";
import { createCollection, mintNFT } from "../../ether/contract_interaction";
import CollectionBoard from "../../components/collection/CollectionBoard";

interface UploadPageProps {
  userId: string;
}

const UploadPage: React.FC<UploadPageProps> = ({ userId }) => {
  // Example: if you later fetch NFTs
  // const [nfts, setNfts] = useState<any[]>([]);
  // const [fetchingCols, setFetchingCols] = useState<boolean>(false);
  // const [selectedNFT, setSelectedNFT] = useState<any>(null);

  // Uncomment and adapt this useEffect if fetching collections later
  /*
  useEffect(() => {
    const getCollection = async () => {
      setFetchingCols(true);
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/nfts/users/${userId}`
          );
          const nft_raw = response.data;

          const withMetadata = await Promise.all(
            nft_raw.map(async (nft: any) => {
              const metadata = await fetchPinataMetaData(nft.ipfs_url);
              return { ...nft, metadata };
            })
          );

          setNfts(withMetadata);
          if (withMetadata[1]) setSelectedNFT(withMetadata[1]);
          setFetchingCols(false);

          console.log("WITH METADATA: ", withMetadata);
        } catch (err) {
          console.error("Failed to fetch collections:", err);
        }
      }
    };
    getCollection();
  }, [userId]);
  */

  return (
    <div id="upload-page" className="flex flex-col p-6 gap-8">
      <div id="word-of-page" className="self-center">
        <h1 className="text-center text-3xl font-bold text-purple-400">
          MANAGE YOUR COLLECTIONS
        </h1>
        <section className="text-2xl">
          Store unique collectible characters with proof of ownership backed by{" "}
          <span className="text-purple-800 text-2xl font-bold">
            Danno's
          </span>{" "}
          ERC721 smart contracts
        </section>
      </div>

      <div id="collection-board">
        <CollectionBoard userId={userId} />
      </div>
    </div>
  );
};

export default UploadPage;

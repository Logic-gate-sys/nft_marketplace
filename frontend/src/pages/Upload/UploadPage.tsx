import { useState, useEffect } from "react";
import CollectionBoard from "../../components/collection/CollectionBoard";
import { useQuery } from "@apollo/client/react";
import { GET_USER_COLLECTIONS } from "../../services/graphql-services";
import CreateCollectionForm from "./CreateCollectionForm";
import { GetCollectionByUserIdData } from "../../services/types";
import { Collection } from "../../services/types";
import { decodeBase64Utf8 } from "../../utils/format";

//------------------ types interfaces

interface UploadPageProps {
  userId: string;
  handleWallectConnect: () => void;
}




const UploadPage: React.FC<UploadPageProps> = ({userId, handleWallectConnect}) => {
  const { loading, error, data } = useQuery<GetCollectionByUserIdData>(GET_USER_COLLECTIONS, { variables: { userId } });
  const [userCollections, setUserCollections] = useState<Collection[]>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string>("");

  //use effect to connect wallet:
  useEffect(() => {
    const connect = () => {
      if (!userId) {
        handleWallectConnect();
      }
    };
    connect();
  }, []);

  //--------------------- retrieve user collections: cast data to any
  /**
   * @contexts This effect fetches all collection belonging to the user:
   * - collection could contain nfts, and the deatils of the user
   */
  useEffect(() => {
  const refineCollections = async () => {
    try {
      const refined = await Promise.all(
        (data?.getCollectionByUserId ?? []).map(async (col) => {
          // ----------------- Refine Collection metadata -----------------
          let col_metaData = {};
          try {
            if (col.URI?.startsWith("ipfs://")) {
              const httpFromCID = col.URI.replace(
                "ipfs://",
                "https://gateway.pinata.cloud/ipfs/"
              );
              const res = await fetch(httpFromCID);
              col_metaData = await res.json();
            }
          } catch (err) {
            console.error("Error fetching collection metadata:", err);
          }

          // ----------------- Refine NFTs and their metadata -----------------
          const nfts = await Promise.all(
            (col.nfts ?? []).map(async (nft) => {
              try {
                if (nft.nftURI.startsWith("ipfs://")) {
                  // ---- Off-Chain NFT ----
                  const httpFromCID = nft.nftURI.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  );
                  const res = await fetch(httpFromCID);
                  const metaData = await res.json();
                  const  nft_metaData = JSON.stringify(metaData);
                  console.log("NFT META DATA (Off-chain): ",JSON.stringify(nft_metaData) );
                  return { ...nft, nft_metaData };
                } else {
                  // ---- On-Chain NFT ----
                  const base64 = nft.nftURI.split(",")[1];
                  const nft_metaData = decodeBase64Utf8(base64);
                  console.log("NFT META DATA (On-chain): ", nft_metaData);
                  return { ...nft, nft_metaData };
                }
              } catch (err) {
                console.error("Error processing NFT metadata:", err);
                return nft;
              }
            })
          );

          // ----------------- Attach both collection + nft metadata -----------------
          return {
            ...col,
            col_metaData,
            nfts,
          };
        })
      );

      console.log("FINAL REFINED COLLECTIONS: ", refined);
      setUserCollections(refined);
    } catch (err) {
      console.error("Error refining collections:", err);
    }
  };

  refineCollections();
}, [data]);


  return (
    <div id="upload-page" className="flex flex-col p-2 gap-2">
        <h1 className="text-center text-3xl font-bold text-purple-400">
          MANAGE COLLECTIONS
        </h1>
      <section className="ml-auto">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 rounded-xl outline-0 p-2 font-bold "
        >
          +Collection
        </button>
      </section>
      {/* -------------------------  CREATE COLLECTION FORM  ----------------------------------- */}
      {showForm && <CreateCollectionForm setShowForm={setShowForm} />}
      <div id="collection-board">
        <CollectionBoard collection={userCollections} />
      </div>
    </div>
  );
};

export default UploadPage;


import { useState, useEffect } from "react";
import CollectionBoard from "../../components/collection/CollectionBoard";
import { useQuery } from "@apollo/client/react";
import { GET_USER_COLLECTIONS } from "../../services/graphql-services";
import CreateCollectionForm from "./CreateCollectionForm";
import { GetCollectionByUserIdData } from "../../services/types";
import { collectionFactoryAbi } from "../../../../shared/constants/contract-constants";

//------------------ types interfaces
interface Collection {
  id: string;
  col_uri: string;
  metadata?: {
    name: string;
    description?: string;
    [key: string]: any;
  };
}

interface UploadPageProps {
  userId: string;
  handleWallectConnect: () => void;
}




const UploadPage: React.FC<UploadPageProps> = ({userId, handleWallectConnect}) => {
  const { loading, error, data } = useQuery<GetCollectionByUserIdData>( GET_USER_COLLECTIONS, { variables: { userId } } );
  // if loading return loading 
  const [selectedCol, setSeletedCol] = useState<Collection[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string>("");
  const [userCollections, setUserCollections] = useState<any[]>();

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
  useEffect(() => {
    const refineCollections = async () => {
      const refined = await Promise.all(
        (data?.getCollectionByUserId ?? []).map(async (col) => {
          const httpFromCID = col.URI?.replace(
            "ipfs://",
            "https://gateway.pinata.cloud/ipfs/"
          );
          const res = await fetch(httpFromCID);
          const col_metaData = await res.json();
          //attach metadata to all collections
          return {
            ...col,
            col_metaData,
          };
        })
      );
      // set collection
      console.log("ARRAY: ", refined);
      setUserCollections(refined);
    };
    refineCollections();
  }, [data]);

  console.log("Refined array: ", userCollections);

  return (
    <div id="upload-page" className="flex flex-col p-2 gap-2">
      <div id="word-of-page" className="self-center">
        <h1 className="text-center text-3xl font-bold text-purple-400">
          MANAGE COLLECTIONS
        </h1>
      </div>
      <section className="ml-auto">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 rounded-xl outline-0 p-2 font-bold "
        >
          +Collection
        </button>
      </section>
      {/* CREATE COLLECTION FORM */}
      {showForm && <CreateCollectionForm setShowForm={setShowForm} />}
      <div id="collection-board">
        <CollectionBoard collection={userCollections} />
      </div>
    </div>
  );
};

export default UploadPage;

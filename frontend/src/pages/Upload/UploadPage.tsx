import { useState, useEffect } from "react";
import CollectionBoard from "../../components/collection/CollectionBoard";
import { useQuery } from "@apollo/client/react";
import { GET_USER_COLLECTIONS } from "../../services/graphql-services";
import CreateCollectionForm   from './CreateCollectionForm'

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
}

const UploadPage: React.FC<UploadPageProps> = ({ userId }) => {
  const {loading, error, data} = useQuery(GET_USER_COLLECTIONS, { variables: { userId } });
  const [selectedCol, setSeletedCol] = useState<Collection[]>();
  const [showForm, setShowForm] = useState<boolean>(false);

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
      <section className="ml-auto">
        <button onClick={()=>setShowForm(true)} className="bg-blue-600 rounded-xl outline-0 p-2 font-bold ">+Collection</button>
      </section>
      {/* CREATE COLLECTION FORM */}
      { showForm && <CreateCollectionForm setShowForm={setShowForm}/>}
      <div id="collection-board">
        <CollectionBoard/>
      </div>
    </div>
  );
};

export default UploadPage;

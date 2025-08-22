import { useState } from "react";
import { NFTCollectionForm } from "../nft/NFTCollectionForm";
import { formatIpfsUrl } from "../../utils/format";
// --------------------------- Types ----------------------------------

// Metadata structure from IPFS
interface CollectionMetadata {
  name: string;
  description: string;
  image: string;
}

// Collection object from backend
export interface Collection {
  id: number;
  metadata: CollectionMetadata;
}

// Props for the component
interface CollectionListCardProps {
  collections: Collection[];
  selectedIndex: number;
  onSelect: (index: number, col_id: number) => void;
}

// --------------------------- Component ----------------------------------
const CollectionListCard: React.FC<CollectionListCardProps> = ({
  collections,
  selectedIndex,
  onSelect,
}) => {
  const [createCollection, setCreateCollection] = useState<boolean>(false);

  //----------- handle creation -----------------------------------------------
  const handleCollectionCreation = () => {
    setCreateCollection((create) => !create);
  };

  return (
    <div id="list-of-collections" className="px-2 border-r border-gray-400">
      {collections.length > 0 ? (
        collections.map((col, indx) => (
          <div
            key={col.id}
            onClick={() => onSelect(indx, col.id)}
            className={`p-2 mb-2 cursor-pointer rounded ${
              indx === selectedIndex ? "bg-blue-400" : "bg-gray-800"
            } hover:bg-blue-500`}
          >
            <div className="flex gap-4 ">
              <img
                src={formatIpfsUrl(col.metadata.image)}
                alt={col.metadata.name}
                className="h-15 w-10"
              />
              <div className="flex flex-col gap-1">
                <h3 className="font-bold">{col.metadata.name}</h3>
                <p className="text-sm text-gray-300">
                  {col.metadata.description.slice(0, 20)}...
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No collections yet</p>
      )}

      <div id="create-col-btn" className="mt-4 mb-4">
        <button
          onClick={handleCollectionCreation}
          className="w-full font-bold bg-blue-700 hover:bg-green-500 p-2 rounded"
        >
          + New Collection
        </button>
      </div>

      {createCollection && <NFTCollectionForm />}
    </div>
  );
};

export default CollectionListCard;

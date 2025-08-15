import { useState } from 'react';
import { NFTCollectionForm } from './NFTCollectionForm';

// --------------------------- Collection list ----------------------------------
const CollectionListCard = ({ collections, selectedIndex, onSelect }) => {
    const [createCollection, setCreateCollection] = useState(false);

    const handleCollectionCreation = () => {
        setCreateCollection(create => !create)
    }

  return (
    <div id="list-of-collections" className="p- border-r border-gray-400 ">
      {collections.length > 0 ? (
        collections.map((col, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(idx)}
            className={`p-2 mb-2 cursor-pointer rounded ${
              idx === selectedIndex ? "bg-blue-400" : "bg-gray-800"
            } hover:bg-blue-500`}
          >
            <h3 className="font-bold">{col.name}</h3>
            <p className="text-sm text-gray-300">
              {col.description.slice(0, 20)}...
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No collections yet</p>
      )}

      <div id="create-col-btn" className="mt-4 mb-4">
        <button onClick={handleCollectionCreation} className="w-full font-bold bg-blue-700 hover:bg-green-500 p-2 rounded">
          + New Collection
        </button>
          </div>
          {
            createCollection && <NFTCollectionForm/>
          }
    </div>
  );
};

export default CollectionListCard;


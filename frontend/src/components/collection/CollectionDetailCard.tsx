import { formatIpfsUrl } from "../utils/helperUtils";



const CollectionInfoCard = ({ selectedCollection }) => {
  if (!selectedCollection) {
    return (
      <div className="p-4 text-gray-400">
        Select a collection to view details
      </div>
    );
  }

  return (
    <div className=" bg-gray-600 border-1 shadow-3xl rounded-r flex flex-col p-2">
      <div id="collection-info" className="mb-4 p-4 bg-gray-800 rounded-lg" style={{ backgroundImage: `url(${formatIpfsUrl(selectedCollection.metadata.image)})` }}>
        <h2 className="text-2xl font-bold">{selectedCollection.metadata.name}</h2>
        <p className="text-gray-300">{selectedCollection.metadata.description}</p>
        <p className="text-sm text-gray-400 font-bold">
          Owner: {selectedCollection.creator_id || "Unknown"}
        </p>
      </div>
      <div id="col-bnt" className="ml-auto flex gap-5">
        <button className="bg-blue-800 rounded-r w-24 p-1 shadow-2xl font-bold">List </button>
        <button className="bg-red-600 rounded-r w-24 p-1 shadow-2xl font-bold"> Unlist </button>
      </div>
    </div>
  );
};



export default CollectionInfoCard;


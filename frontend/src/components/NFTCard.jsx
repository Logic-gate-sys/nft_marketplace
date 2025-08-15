

const NFTCard = ({ nft }) => {
  return (
      <div className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700">
          {/*<img/>*/}
      <h4 className="font-bold">
        {nft.name} #{nft.id}
      </h4>
      <p className="text-sm text-gray-300">Price: {nft.price}</p>
      <p className="text-xs text-gray-400">Owner: {nft.owner}</p>
    </div>
  );
};  


export default NFTCard;
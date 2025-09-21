import NFTCard from "../ui/ntf-card";
import CollectionCard from "../ui/collection-card";
import NFTDetail from "../ui/nft-detail-card";
import CollectionDetailCard from "../ui/collection-detail";
import { formatIpfsUrl } from "../../utils/format";
import { ChangeEvent, useState } from "react";
import { MintForm } from "../form/MintForm";
import { cakeNFTAbi, MARKET_PLACE_ADDRESS, CAKE_ADDRESS, marketPlaceAbi } from "../../../../shared/constants/contract-constants";
import { connectWallet } from "../../ether/wallet_interactions";
import { getWriteContractInstance, approveMarketPlace, listNFT } from "../../ether/contract_interaction";
import { Spinner } from "../effect/helperComponents";
import { getListedLogs } from '../../services/nft-indexing';





export default function CollectionsPage({ collection }: any) {
  //------------------------- hooks ---------------------------------------------
  const [selColIndex, setSelColIndex] = useState<number>(); // <<------- first collection index is selected by default
  const [selectedCol, setSeletedCol] = useState(collection?.[0]);
  const [selTokenId, setSelTokenId] = useState();
  const [wantsToMint, setWantsToMint] = useState<boolean>(false);
  const [wantsToList, setWantsToList] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCollectionSelected = (index: number): any => {
    //set new index
    setSelColIndex(() => index);
    //set selected colllection
    setSeletedCol(() => collection?.[index]);
  };
  console.log("SELECTED COLLECTION INDEX: -------->>> ", selColIndex);
  console.log("SELECTED COLLECTION:-------->>>", selectedCol);

  // -------------------- handle price change ---------------------
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number( e.target.value);
    setPrice( val);
  }

  //------------------------ Handle NFT list ---------------------------------
  const handleListNFT = async () => {
    try {
      setLoading(true)
      const tokenId = selTokenId;
      if (!tokenId) {
        console.log("----------- NO TOKEN ID ------------")
        setLoading(false);
        return;
      }
      console.log("TOKEN ID : ", tokenId);
      const nFTContractAddress = selectedCol?.col_metaData.contractAddress;
    
      // wallect connect
      const { signer, wallet, provider } = await connectWallet();
      // nft contract instance
      const nftContractInstance = await getWriteContractInstance(
        nFTContractAddress,
        cakeNFTAbi,
        signer
      );
      if (!nftContractInstance) {
        setLoading(false);
        console.log("No contract instance found");
        return;
      }
       console.log("CONTRACT INSTANCE: ", nftContractInstance);
      // approve marketplace  to list nft
      const approved = await approveMarketPlace(nftContractInstance, MARKET_PLACE_ADDRESS, tokenId);
      if (!approved) {
        console.log("Approval failed");
        setLoading(false);
      }
      console.log("------------- Approval successful --------------------------")
      //marketPlace contract instance
      const marketPlaceInstance = await getWriteContractInstance(MARKET_PLACE_ADDRESS, marketPlaceAbi, signer);
      // list nft
      const receipt = await listNFT(marketPlaceInstance, nFTContractAddress, BigInt(tokenId), BigInt(price));
      const result = getListedLogs(receipt);
      if (!result) {
        console.log("Listing failed");
        setLoading(false);
        return;
      }
      console.log("NFT LISTING RECEIPT:----->>> " , receipt);
      const { _nftAddress, _tokenID, _price } = result;
      //------------- on successful listing 
      setLoading(false);
      setWantsToList(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };




  return (
    <main className="mx-auto  max-w-7xl space-y-10 p-4 md:p-6">
      {/*------------------- USER collections and Details---------------------- */}
      <h2 className="mb-3 text-lg font-bold uppercase text-zinc-400">
        My Collections
      </h2>
      <section id="col-to-detaisl" className="grid grid-cols-[1.5fr_5fr] gap-1">
        {/*============================ Collection ===================== */}
        <section>
          <div className="h-screen overflow-y-scroll scrollbar-hide border-zinc-800 border-2 p-2 rounded-2xl flex flex-col gap-2 ">
            {collection?.map((col: any, id: any) => {
              const image = formatIpfsUrl(col.col_metaData.image_uri);
              const title = col.col_metaData.title;
              const description = col.col_metaData.description;
              const symbol = col.col_metaData.symbol;
              return (
                <button
                  key={id}
                  onClick={() => handleCollectionSelected(id)}
                  className="active:scale-105 active: active:border- border-amber-200"
                >
                  <CollectionCard
                    key={id}
                    image={image}
                    title={title}
                    description={description}
                  />
                </button>
              );
            })}
          </div>
        </section>
        {/* -------------------- SELECTED COLLECTION -------------- */}
        <section
          id="col-details nfts"
          className="h-screen overflow-y-auto border-zinc-800 border-2 p-2 rounded-2xl"
        >
          <CollectionDetailCard
            name={selectedCol?.col_metaData.title}
            type={selectedCol?.col_metaData.type}
            banner={formatIpfsUrl(selectedCol?.col_metaData.image_uri)}
            logo={formatIpfsUrl(selectedCol?.col_metaData.image_uri)}
            description={selectedCol?.col_metaData.description}
            floorPrice="0.8"
            volume="2.5K"
            owners={`${selectedCol?.owner.wallet.slice(0, 12)}...`}
            items={selectedCol?.nfts.length}
          />
          {/*------------------->> NFTs */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase text-zinc-400">
              NFTs
            </h2>
            <button
              onClick={() => setWantsToMint(true)}
              className="bg-green-600 rounded-xl outline-0 px-4 py-2 font-bold m-3 active:scale-105 "
            >
              {" "}
              Mint{" "}
            </button>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {selectedCol?.nfts?.map((nft: any, id: number) => {
                const nftMetaData = JSON.parse(nft.nft_metaData);
                const image = formatIpfsUrl(nftMetaData.image);
                const name = nft.name;
                const collectionName = nft.name;
                const tokenId = nft.tokenId;
                return (
                  <NFTCard
                    key={id}
                    image={image}
                    name={name}
                    collectionName={collectionName}
                    tokenId={tokenId}
                    setWantsToList={setWantsToList}
                    setTokenId={()=>setSelTokenId(nft?.tokenId)}
                  />
                );
              })}
            </div>
            {/* --------------------------- MINT FORM ----------------------------------------------- */}
            {wantsToMint && (
              <MintForm
                col_id={selectedCol?.id}
                col_name={selectedCol?.col_metaData.title}
                type={selectedCol?.col_metaData.type}
                col_address={selectedCol?.col_metaData.contractAddress}
                col_owner={selectedCol?.owner.user_id}
                setWantsToMint={setWantsToMint}
              />
            )}
          </section>
        </section>
        {/* -------------------------------- LIST FORM ---------------------------- */}
        {wantsToList && (
            <section>
              <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-50 z-99">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                  Set NFT Price
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter price"
                    onChange={handlePriceChange}
                    className="w-full px-4  text-black py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <section className="flex gap-3">
                  <button onClick={handleListNFT}  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition">
                    List NFT
                  </button>
                  <button
                    onClick={() =>setWantsToList(false)}
                    className="w-full bg-orange-500 hover:bg-orange-300 text-white font-medium py-2 px-4 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </section>
              </div>
            </div>
            {loading && <Spinner/>}
          </section>
        )}
      </section>
    </main>
  );
}

import React from "react";
import NFTCard from "../ui/ntf-card";
import CollectionCard from "../ui/collection-card";
import NFTDetail from "../ui/nft-detail-card";
import CollectionDetailCard from "../ui/collection-detail";
import { formatIpfsUrl } from "../../utils/format";

export default function CollectionsPage({ collection }: any) {
  if (collection) {
    console.log("COLLECTION RETURNED: ", collection);
  }
  return (
    <main className="mx-auto  max-w-7xl space-y-10 p-4 md:p-6">
      {/* Collections */}
      <section>
        <h2 className="mb-3 text-lg font-bold uppercase text-zinc-400">
          My Collections
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection?.map((col: any, id: any) => {
            const image = formatIpfsUrl(col.col_metaData.image_uri);
            const title = col.col_metaData.title;
            const description = col.col_metaData.description;
            const symbol = col.col_metaData.symbol;
            return (
              <CollectionCard key={id} image={image} title={title} description={description} />
            )
          })}
        </div>
      </section>
      <section>
        <CollectionDetailCard
          name="Crypto Ducks"
          banner="https://picsum.photos/id/1005/1200/300"
          logo="https://picsum.photos/id/100/200"
          description="A quirky collection of 10,000 unique ducks living on the Ethereum blockchain. Waddle your way into the community!"
          floorPrice="0.8"
          volume="2.5K"
          owners="1.2K"
          items="10K"
        />

        {/* NFTs */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase text-zinc-400">
            NFTs
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <NFTCard />
            <NFTCard />
            <NFTCard />
            <NFTCard />
          </div>
        </section>

        {/* NFT Detail */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase text-zinc-400">
            NFT Detail
          </h2>
          <NFTDetail />
        </section>
      </section>
    </main>
  );
}

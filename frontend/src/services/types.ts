// src/graphql/types.ts
export type NFT = {
  nft_id: string;
  tokenId: string;
  nftURI: string;
  name: string;
  owner: {
    user_id: string;
    wallet: string;
  };
};

// export type Collection = {
//   id: string;
//   URI: string;
//   createdAt: string | null;
//   owner: {
//     user_id: string;
//     wallet: string;
//   };
//   nfts: NFT[];
// };

export type GetCollectionByUserIdData = {
  getCollectionByUserId: Collection[];
};

// ------------------------------- Collections --------------------
export interface CollectionMetadata {
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

export interface CollectionProp{
    id: number;
    name: string;
    cover: string;
    items: number; // total items in collection 
    floorPrice: number;
    creator: string; // account or username of creator

}

export interface Collections{
  collections: CollectionProp[];
}


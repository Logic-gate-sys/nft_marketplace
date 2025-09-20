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

export type Collection = {
  id: string;
  URI: string;
  createdAt: string | null;
  owner: {
    user_id: string;
    wallet: string;
  };
  nfts: NFT[];
};

export type GetCollectionByUserIdData = {
  getCollectionByUserId: Collection[];
};

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


export interface CollectionCardProps{
  id: number;
  name: string;
  cover: string;
  items:any;
  floorPrice: bigint;
  creator: string;
  volume: number;
  onClick?: () => void;
  loading?: boolean;
}

export interface NFTCardProps {
  id: string | number;
  tokenId: number | string;
  name: string;
  image?: string | null;
  collection?: string;
  price?: number | string | null;
  lastPrice?: number | string | null;
  endTime?: string | Date;
  isListed?: boolean;
  context?: 'studio' | 'marketplace';
  onClick?: () => void;
  onFavorite?: () => void;
  onBuy?: () => void;
  onList?: () => void;
  onUnlist?: () => void;
  isFavorited?: boolean;
  loading?: boolean;
}

export interface PopupMessageBoxProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}


// Collection creating forms
export interface CreateCollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CollectionFormData) => void;
}

export interface CollectionFormData {
  owner_id: number , 
  contractAddress: string,
  name: string;
  description: string;
  symbol: string;
  category: string;
  royalties: number;
  coverImage: File | null;
  logoImage: File | null;
  type?: 'onchain' | 'offchain';
}

export interface CreateCollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CollectionFormData) => void;
}


export interface FetchedCollection {
  id: string;
  name: string;
  cover: string;
  logo: string;
  description: string;
  symbol: string;
  category: string;
  contractAddress: string;
  items: number;
  listedItems: number;
  nfts: any
  floorPrice: number;
  volume: number;
  creator: string;
  creatorName: string;
  creatorId: number;
  createdAt: string;
};


export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

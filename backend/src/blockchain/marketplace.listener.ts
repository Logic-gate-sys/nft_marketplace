import { ethers } from 'ethers';
import { handleListing , handleListingCancelling} from './handlers';
import { JsonRpcProvider } from "ethers";





// RPC URL from .env
const RPC_URL = process.env.RPC_URL; 
if (!RPC_URL) {
  throw new Error("RPC_URL is not set in environment variables");
}


export const provider = new JsonRpcProvider(RPC_URL);


provider.getNetwork().then(network => {
    console.log(`Provider is connected to network ${network.name} with chain id ${network.chainId}`);
})

const MARKETPLACE_SEPOLIA_ADDRESS = '0xcBd9450dF1d8d8eDDCb2D2870bE70003ab7E8B7b'


 const MARKETPLACE_SEPOLIA_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_platformFeeRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_platformFeePercent",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__AmountMustBeGreaterThanZero",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__CannotBuyYourOwnNFT",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__CannotGiftToSelf",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__CannotGiftToZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__ETHTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__InsufficientETHSent",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__InsufficientRevenue",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__InvalidPlatformFee",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__InvalidPricingParameter",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "MarketPlace__NFTAlreadyListed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "MarketPlace__NFTNotListed",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__NotApprovedForMarketplace",
    type: "error",
  },
  {
    inputs: [],
    name: "MarketPlace__NotOwnerOfNFT",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ETHReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
    ],
    name: "ListingCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "NFTGifted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newComputedPrice",
        type: "uint256",
      },
    ],
    name: "NFTSold",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRecipient",
        type: "address",
      },
    ],
    name: "PlatformFeeRecipientUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newFeePercent",
        type: "uint256",
      },
    ],
    name: "PlatformFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "PriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "appreciationRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depreciationRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "volumeMultiplier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "velocityThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriceMultiplier",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct MarketPlace.PricingConfig",
        name: "newConfig",
        type: "tuple",
      },
    ],
    name: "PricingConfigUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RevenueWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "basePrice",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
    ],
    name: "TokenListed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "buyNft",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "cancelListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getCurrentPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getListing",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "basePrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "listingTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTradeVolume",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tradeCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastTradeTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lastTradePrice",
            type: "uint256",
          },
        ],
        internalType: "struct MarketPlace.Listing",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserRevenue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "giftNft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isNftListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "basePrice",
        type: "uint256",
      },
    ],
    name: "listNft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFeePercent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFeeRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pricingConfig",
    outputs: [
      {
        internalType: "uint256",
        name: "appreciationRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "depreciationRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "volumeMultiplier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "velocityThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPriceMultiplier",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMarketplaceTrades",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMarketplaceVolume",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newFeePercent",
        type: "uint256",
      },
    ],
    name: "updatePlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newRecipient",
        type: "address",
      },
    ],
    name: "updatePlatformFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "appreciationRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depreciationRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "volumeMultiplier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "velocityThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriceMultiplier",
            type: "uint256",
          },
        ],
        internalType: "struct MarketPlace.PricingConfig",
        name: "newConfig",
        type: "tuple",
      },
    ],
    name: "updatePricingConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAllRevenue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawRevenue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

//market place contract
const marketplace_contract = new ethers.Contract(MARKETPLACE_SEPOLIA_ADDRESS, MARKETPLACE_SEPOLIA_ABI, provider);


export const startMarketPlaceListeners = async () => {
    console.log("Market place event listener started ");

    // token list handler
  marketplace_contract.on(
    "TokenListed",
    async ( nftAddress, tokenId, basePrice,seller, event) => {
      try {
        // handling listing 
        await handleListing(marketplace_contract, nftAddress, tokenId, basePrice)
      } catch (e: any) {
        console.log("Error: ", e);
        return;
      }
    }
        
  );

  // -------- Cancelling listing -
  marketplace_contract.on("ListingCancelled", async (nftAddress, tokenId, sender, event) => {
    try {
      await handleListingCancelling(nftAddress, tokenId);
    } catch (e: any) {
      console.log("Error: ", e);
        return;
    }
    
  });

  
}








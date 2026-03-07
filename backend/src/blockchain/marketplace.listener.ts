import { handleListing, handleListingCancelling } from './listsHandlers.ts';
import {handleBuy} from './buyHandlers.ts'
import { marketplace_contract } from '../utils/contracts.ts';



export const startMarketPlaceListeners = async () => {
  console.log("Market place event listener started ");
    //--------- token listing 
  marketplace_contract.on("TokenListed", async ( nftAddress, tokenId, basePrice,seller, event) => {
      try {
        // handling listing 
        await handleListing(marketplace_contract, nftAddress, tokenId, basePrice)
      } catch (e: any) {
        console.log("Error: ", e);
        return;
      }
    }     
  );

  // ---------- Listing cancelling 
  marketplace_contract.on("ListingCancelled", async (nftAddress, tokenId, sender, event) => {
    try {
      await handleListingCancelling(nftAddress, tokenId);
    } catch (e: any) {
      console.log("Error: ", e);
        return;
    }
    
  });

   // ------------ Buying 
  marketplace_contract.on("NFTSold", async (nftAddress, tokenId, price, buyer, seller, newComputedPrice, event) => {
     await handleBuy(nftAddress, tokenId, price, buyer, seller, newComputedPrice)
  });

  
}








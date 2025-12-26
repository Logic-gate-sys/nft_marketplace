import { ethers, Signer, Provider, Signature, ZeroAddress, Contract } from "ethers";
import axios from "axios";
import { Token } from "graphql";
import { parse } from "path";
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
/*
--------------- MODE OF INTERACTIONS ---------------- :
1. login with wallet address via metamusk should only allow users to view their collections :
2. Explicit mint-button click should trigger metamusk signing and subsequent gas +/ fee payment authorisation
3. Explicit list should prompt metamust for signing and appropriate gas payment to list
4. Explicit buy operation should trigger metamust signer for payment authorisation
5. Explicity unlisting of nft should also trigger metamusk for approval and gas payment
6. Log appropriate events / errors involved in signed transactions
*/

/**
 * @remarks
 * This function does not create a new contract , just retrieve and instance of already deployed contract
 * -for a deploy contract the abi comes from etherscan
 * @param signer - owner of and account
 * @param address - contract address
 * @param abi - abi of the contract address
 * @returns  an instance of the contract who's abi and address are provided by the user
 */
export const getWriteContractInstance = (
  address: string,
  abi: any,
  signer: Signer
) => {
  try {
    //contract instance
    const contractInstance = new ethers.Contract(address, abi, signer);
    if (!contractInstance) {
      console.log("Could not retrieve contract instance, invalid inputs");
      return;
    }
    return contractInstance;
  } catch (err: any) {
    throw new Error(err);
  }
};



export const fetchContractABI = async (contractAddress: string, token: string) => {
  const res = await fetch(`${BASE_URL}/collections/collection/abi?contractAddress=${contractAddress}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  if (!res.ok) {
    console.log("Could not retrieve ABI");
    return;
  }
  // get abi 
  const { data } = await res.json();

  return data;
}



/**
 * @remarks This deals with the contract instance that we can only perform read operations on
 * @param address - contract address
 * @returns an instance of the readonly contract instance
 */
export const getReadOnlyContractInstance =  (
  address: string,
  abi: any,
  provider: Provider
) => {
  const readableContract = new ethers.Contract(address, abi, provider);
  if (!readableContract) {
    console.log("Could not get Readable contract instance!");
    return;
  } else {
    return readableContract;
  }
};




// /**
//  * 
//  * @param provider 
//  * @param collection_addr 
//  * @returns 
//  */
// export const getNextNFTID = async (provider, collection_addr) => {
//   const readable_collection_contract = new ethers.Contract(
//     collection_addr,
//     collection_abi.abi,
//     provider
//   );
//   const previous_id = await readable_collection_contract.getNextId();
//   return previous_id.toNumber();
// };


//---------------------------------- mint Onchain function -----------------------
type MintResponseData = {
  from: string | any,
  to: string | any,
  tokenId: bigint | any,
}
export const mintOnChain = async (contractInstance: any, to: string): Promise<MintResponseData | any> => {
  try{
    const trx = await contractInstance.mint(to); 
    console.log("Mint Transaction -------------: ", trx);
    const receipt = await trx.wait();
    //if transaction producess no receipt
    if (!receipt) {
      console.log("Could not Mint");
      return;
    }
    // return receipt
    for (const log of receipt.logs) {
      const parsed = await contractInstance.interface.parseLog(log);
      if (parsed && parsed.name === 'Transfer') {
        const [from, to, tokenId] = await parsed.args;
        if (from === ZeroAddress) {
          return { from, to, tokenId };
        }
      }
  }
  } catch (err) {
    console.log(err);
    return;
  }
}

// --------------------------------- mint OffChain function ----------------------------
export const mintOffChain = async (contractInstance: any, URI: string) : Promise<MintResponseData | any> => {
  try {
    const trx = await contractInstance["mint(string)"](URI);
    if (!trx) {
      console.log("Off chain minting failed! ");
      return;
    }
    const receipt = await trx.wait();
    if (!receipt) {
      console.log("No off-chain mint receipt found ");
      return;
    }
    for (const log of receipt.logs) {
      const parsed = contractInstance.interface.parseLog(log);
      if (parsed && parsed.name === 'Transfer') {
        const [from, to, tokenId] = parsed.args;
        if (from === ZeroAddress) {
          return { from, to, tokenId };
        }
      }
    }
  } catch (err: any) {
    console.log('Error! : ', err);
    return;
  }
}
  

/**
 * 
 * @param contractInstance : nft contract whose nft is being listed
 * @param marketPlaceAddr  : address of the market place contract 
 * @param tokenId : Token to be listed on the market place
 * @returns 
 */
export const approveMarketPlace = async (contractInstance: any, marketPlaceAddr: string, tokenId: number): Promise<boolean> => {
  const trx = await contractInstance.approve(marketPlaceAddr, tokenId);
  const receipt = await trx.wait();
  if (!receipt) {
    console.log("Approval for market Place failed")
    return false;
  }
  // if transaction was throw 
  return true;
}



/**
 * @param marketPlace contract instance of the marketplace 
 * @param TokenId id of the token to be listed
 * @param nftAddress  contract address of the nft collection
 * @param basePrice initial prices set by the user 
 * @returns  returnes object pertaining to listing event 
 */
export const listToken = async (marketPlace: any, TokenId: bigint, nftAddress: string, basePrice: bigint) => {
  try {
    // listing token 
    const trx = await marketPlace.listNft(nftAddress, TokenId, basePrice);
    const receipt = await trx.wait();

    // search in receipt for tokenListed event 
    for (const log of receipt.logs) {
      const parsed =  marketPlace.interface.parseLog(log);
      if (parsed && parsed.name === "TokenListed ") {
        const [nftAddress, tokenId, basePrice, seller] = log.args

        return {
          success: true, 
          tokenId: tokenId,
          nftAddress: nftAddress,
          basePrice: basePrice,
          seller: seller
        }
      }
    }
  } catch (e: any) {
    console.log("Error : ", e);
    return;
  }

}
 


import { ethers, Signer, Provider } from "ethers";
import {
  CAKE_ADDRESS,
  cakeNFTAbi,
} from "../../../shared/constants/contract-constants";
import axios from "axios";
import { AsyncResource } from "async_hooks";

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

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
 * @param signer - owner of and account
 * @param address - contract address
 * @param abi - abi of the contract address
 * @returns  an instance of the contract who's abi and address are provided by the user
 */
export const getWriteContractInstance = async (
  address: string,
  abi: any,
  signer: Provider
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

/**
 * @remarks This deals with the contract instance that we can only perform read operations on
 * @param address - contract address
 * @returns an instance of the readonly contract instance
 */
export const getReadOnlyContractInstance = async (
  address: string,
  abi: any,
  provider: Signer
): any => {
  const readableContract = new ethers.Contract(address, abi, provider);
  if (!readableContract) {
    console.log("Could not get Readable contract instance!");
    return;
  } else {
    return readableContract;
  }
};

/**
 * @remarks
 * A countract that's not deployed on the local, we need to fetch it's abi from etherscan
 * This function fetches the verified contract ABI from Etherscan
 * @param address - The Ethereum contract address
 * @returns Parsed ABI (array of JSON objects)
 */
export async function fetchAbiFromEtherscan(address: string): Promise<any[]> {
  try {
    const url = `${ETHERSCAN_BASE_URL}?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status !== "1") {
      throw new Error(`Etherscan error: ${response.data.result}`);
    }
    return JSON.parse(response.data.result); // ABI as JS object
  } catch (err: any) {
    throw new Error(`Failed to fetch ABI: ${err.message}`);
  }
}


/**
 * 
 * @param provider 
 * @param collection_addr 
 * @returns 
 */
export const getNextNFTID = async (provider, collection_addr) => {
  const readable_collection_contract = new ethers.Contract(
    collection_addr,
    collection_abi.abi,
    provider
  );
  const previous_id = await readable_collection_contract.getNextId();
  return previous_id.toNumber();
};

// ---------------------- mint into collection ----------------------------
export const mintNFT = async (signer:any, collection_addr:string, ipfs_uri:string) => {
  try {
    //get the writeable contract instance
    const collection_contract = new ethers.Contract(
      collection_addr,
      collection_abi.abi,
      signer
    );
    // now mint
    const trx = await collection_contract.mint(ipfs_uri);
    const receipt = await trx.wait();
    if (!receipt) {
      console.log("COULD NOT MINT NFT : ");
      return;
    }
    return receipt;
  } catch (error) {
    console.log(error);
    return;
  }
};

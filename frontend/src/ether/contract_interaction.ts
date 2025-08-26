// import { ethers } from 'ethers';


// /*
// --------------- MODE OF INTERACTIONS ---------------- :
// 1. login with wallet address via metamusk should only allow users to view their collections :
// 2. Explicit mint-button click should trigger metamusk signing and subsequent gas +/ fee payment authorisation
// 3. Explicit list should prompt metamust for signing and appropriate gas payment to list
// 4. Explicit buy operation should trigger metamust signer for payment authorisation
// 5. Explicity unlisting of nft should also trigger metamusk for approval and gas payment
// 6. Log appropriate events / errors involved in signed transactions
// */

// // for transactions involving a signer
// export const createCollection = async (signer:string, name:string, symbol:string, total_supply:string,contract_uri) => {
//   if (!COLLECTION_FACTORY_ADDRESS) {
//     console.log("No contract address provided from env");
//     return;
//  }
//   /*
//   Any collection created from the smart contract has the following:
//   name,symbol, and total supply.
//   */
//   try {
//     //contract instance 
//     const collection_factory_contract = new ethers.Contract(COLLECTION_FACTORY_ADDRESS, factory_abi.abi, signer); 
//     //a transaction occurs
//     const trx = await collection_factory_contract.createCollection(name, symbol, total_supply,contract_uri);
//     // get transactiaon receipt after transaction is mined
//     const receipt = await trx.wait()// wait for transaction to be mined
//     if (receipt) {
//       console.log("TRX RECEIPT: ", receipt);
//     }
//     const event = receipt.logs.map((log) => {
//       try {
//         return collection_factory_contract.interface.parseLog(log);
//       } catch{
//         return null;
//       }
//     }).find(e => e && e.name == 'CollectionCreated');
//     if (!event) {
//       console.log("No event found for the create-collection function ");
//       return;
//     }
//     const creator = event.args.creator;
//     const collectionAddress = event.args.collection;
//     console.log("COLLECTION ADDRESS: ", collectionAddress);
//     // return the collection cloned contract 
//     return {creator, collectionAddress};
//   } catch (error) {
//     console.log("Could not get contract instance", error);
//     return;
//   }
// }




// // reading blockchain state 
// export const read_from_contract = async (provider) => {
//   try {
//     //contract instance 
//     const contract = new ethers.Contract(COLLECTION_FACTORY_ADDRESS, abi, provider); // get contract object 

//     return contract;
//   } catch (error) {
//     console.log("Could not get contract instance", error);
//     return;
//   }
// }

// export const getNextNFTID = async (provider, collection_addr) => {
//   const readable_collection_contract = new ethers.Contract(collection_addr, collection_abi.abi, provider);
//   const previous_id = await readable_collection_contract.getNextId();
//   return previous_id.toNumber();
// }

// // ---------------------- mint into collection ----------------------------
// export const mintNFT = async ( signer, collection_addr, ipfs_uri) => {
//   try {
//     //get the writeable contract instance
//     const collection_contract = new ethers.Contract(collection_addr, collection_abi.abi, signer);
//     // now mint 
//     const trx = await collection_contract.mint(ipfs_uri);
//     const receipt = await trx.wait();
//     if (!receipt) {
//       console.log("COULD NOT MINT NFT : ");
//       return;
//     }
//     return receipt;
//   } catch (error) {
//     console.log(error);
//     return
//   }
// }


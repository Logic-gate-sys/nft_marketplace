import { Contract, ethers, Provider} from 'ethers';
import { prisma } from './../lib/prisma';
import { fetchAbiFromEtherscan } from '@/utils/ABI';
import { provider } from './marketplace.listener'





export const r_contract = async(address: string) => {
    const abi = await fetchAbiFromEtherscan(address);
    return new ethers.Contract(address, abi, provider);
}
/**
 *
 * @param address : address of the contract event listener returnes
 * @param provider :jsonrpc provider
 * @param tokenId : nft address
 * @returns tokenURI
 */
export const getTokenURI = async (
  address: string,
  provider: Provider,
  tokenId: bigint
) => {
  const abi = await fetchAbiFromEtherscan(address);
    const contract = await r_contract(address);
  const tokenURI = await contract.tokenURI(tokenId);
  if (!tokenURI) {
    console.log('Failed to get token url in the event listener');
    return;
  }

  // return token uri
  return tokenURI;
};


/**
 *
 * @param marketplace
 * @param nftAddress
 * @param tokenId
 * @param basePrice
 * @param seller
 * @param event
 * @returns  prisma upserting result
 */

export const handleListing = async (
  marketplace: Contract,
  nftAddress: string,
  tokenId: bigint,
  basePrice: bigint,
) => {
  try {
    // Verify chain state
    const listed = await marketplace.isNftListed(nftAddress, tokenId);
    if (!listed) return;

    // Read canonical on-chain data
    const listing = await marketplace.getListing(nftAddress, tokenId);

    const currentPrice = await marketplace.getCurrentPrice(nftAddress, tokenId);

    // READ CONTRACT INSTACE TO GET TOKEN uri
    const tokenURI = await getTokenURI(nftAddress, provider, tokenId);
    if (!tokenURI) {
      console.log("Failed to fetch token uri");
      return;
    }
    console.log("TOKEN ID : ", Number(tokenId));
    console.log("URI : ", tokenURI);

    // update 
    await prisma.nft.update({
      where: {
        uri: tokenURI
      },
      data: {
        base_price: ethers.formatEther(basePrice),
        current_price:ethers.formatEther(currentPrice),
        status: "listed"
      }
    }); 

  } catch (err: any) {
    console.log("Error", err);
  }
};



export const handleListingCancelling = async (
  nftAddress: string,
  tokenId: bigint) => {
  
  // go  fetch token uri
  const tokenURI = await getTokenURI(nftAddress, provider, tokenId);
  if (!tokenURI) {
    console.log("Failed to get token URI of token to be unlisted");
    return;
  }
  await prisma.nft.update({
    where: {
      uri: tokenURI,
    },
    data: {
      base_price: null,
      current_price: null,
      status:"unlisted"
    }
  })
}
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
  seller: string
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

    const nft = await prisma.nft.findFirst({
      where: {
        token_id: Number(tokenId),
        uri: tokenURI,
      },
    });
    if (!nft) {
      console.log('Could not find nft');
      return;
    }
      const collection_id = nft.col_id;

    // Mirror EXACT chain state into DB
    await prisma.listings.upsert({
      where: {
            col_id_token_id: {
              col_id: collection_id,
              token_id: Number(tokenId)
            },
      },
      // if record exists
      update: {
        seller: seller,
        base_price: basePrice,
        current_price: currentPrice,
      },
      // if record is new
      create: {
        col_id: collection_id,
        token_id: Number(tokenId),
        seller: seller,
        base_price: basePrice,
      },
    });

    console.log('Listing synced:', nftAddress, tokenId.toString());
  } catch (err) {
    console.error('Listing sync failed:', err);
  }
};

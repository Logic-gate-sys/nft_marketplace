import { Contract, ethers, Provider } from 'ethers';
import { prisma } from './../lib/prisma';
import { fetchAbiFromEtherscan } from '../utils/ABI';
import { provider } from './marketplace.listener';

export const r_contract = async (address: string) => {
  const abi = await fetchAbiFromEtherscan(address);
  return new ethers.Contract(address, abi, provider);
};
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
  basePrice: bigint
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
      console.log('Failed to fetch token uri');
      return;
    }
    console.log('TOKEN ID : ', Number(tokenId));
    console.log('URI : ', tokenURI);

    // update
    await prisma.nft.update({
      where: {
        uri: tokenURI,
      },
      data: {
        base_price: ethers.formatEther(basePrice),
        current_price: ethers.formatEther(currentPrice),
        status: 'listed',
        changed: true,
      },
    });
  } catch (err: any) {
    console.log('Error', err);
  }
};

export const handleListingCancelling = async (
  nftAddress: string,
  tokenId: bigint
) => {
  // go  fetch token uri
  const tokenURI = await getTokenURI(nftAddress, provider, tokenId);
  if (!tokenURI) {
    console.log('Failed to get token URI of token to be unlisted');
    return;
  }
  await prisma.nft.update({
    where: {
      uri: tokenURI,
    },
    data: {
      status: 'waiting',
      changed: true,
    },
  });
};

export const handleBuy = async (
  nftAddress: string,
  tokenId: bigint,
  price: bigint,
  buyer: string,
  seller: string,
  newComputedPrice: bigint
) => {

  const tokenURI = await getTokenURI(nftAddress, provider, tokenId);
  //find buy
  const nft_owner = await prisma.user.findUnique({
    where: { wallet: buyer.toLocaleLowerCase() }
  });
  // transaction 
  await prisma.$transaction([
    // nft table update 
    prisma.nft.update({
      where: { uri: tokenURI },
      data: {
        owner_id: nft_owner?.id,
        base_price: ethers.formatEther(price),
        current_price: ethers.formatEther(newComputedPrice),
        changed: true
      }
    }),
    //sold table update 
    prisma.sold.create({
      data: {
        token_id: Number(tokenId),
        buyer: buyer,
        seller: seller,
        price: ethers.formatEther(price),
        changed: true
      }
    }),
  ]);
}
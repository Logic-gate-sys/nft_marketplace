import { Contract, ethers, JsonRpcProvider as Provider } from 'ethers';
import { prisma } from '../lib/prisma.ts';
import { provider } from '../utils/jsonRPC.ts'
import { getTokenURI } from '../utils/blockchain.ts';



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


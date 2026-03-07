import { ethers} from 'ethers';
import { prisma } from '../lib/prisma.ts';
import { provider } from '../utils/jsonRPC.ts'
import { getTokenURI } from '../utils/blockchain.ts';


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




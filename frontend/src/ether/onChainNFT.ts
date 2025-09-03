import { Contract, ethers, EtherscanProvider } from 'ethers';
import { CAKE_ADDRESS, cakeNFTAbi } from '../../../shared/constants/contract-constants'


export function createNFTCollection(signer: ethers.JsonRpcSigner) {
    const contract = new ethers.Contract(String(CAKE_ADDRESS), cakeNFTAbi, signer);
    if (!contract) {
        console.log("Invalid NFT address provided");
    }
}
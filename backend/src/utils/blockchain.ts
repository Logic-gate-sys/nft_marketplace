import { Contract, ethers, JsonRpcProvider as Provider } from 'ethers';
import { fetchAbiFromEtherscan } from '../utils/ABI.ts';
import { provider } from './jsonRPC.ts'


export const getTokenURI = async ( address: string, provider: Provider, tokenId: bigint): Promise <string> => {
  const abi = await fetchAbiFromEtherscan(address);
  const contract = await r_contract(address);
  const tokenURI = await contract.tokenURI(tokenId);
  if (!tokenURI) {
    console.log('Failed to get token url in the event listener');
    return 'undefined' ;
  }
  // return token uri
  return tokenURI;
};


export const r_contract = async (address: string) :Promise<Contract>=> {
  const abi = await fetchAbiFromEtherscan(address);
  return new ethers.Contract(address, abi, provider);
};
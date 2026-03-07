import { ethers } from 'ethers'; 
import { MARKETPLACE_SEPOLIA_ABI, MARKETPLACE_SEPOLIA_ADDRESS } from './constants.ts';
import { provider } from './jsonRPC.ts'


//market place contract
export const marketplace_contract = new ethers.Contract(MARKETPLACE_SEPOLIA_ADDRESS, MARKETPLACE_SEPOLIA_ABI, provider);
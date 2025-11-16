import axios from 'axios';
import { ethers } from 'ethers';


interface NonceResponse {
  message: string;
}

interface BackendResponse {
  success: boolean;
  [key: string]: any;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
    };
  }
}


// -------------------- Connect wallet
export const connectWallet = async (): Promise<any> => {
  try {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log('MetaMask detected');
    //get provider,signer and wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const wallet = (await signer.getAddress()).toLowerCase();
    console.log("CONNECTION SUCESSFUL !  DETAILS: ", provider);
    return { provider, signer, wallet };
    
  } catch (error) {
    console.error('Wallet connection failed', error);
    return;
  }
};







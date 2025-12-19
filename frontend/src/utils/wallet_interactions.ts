import { ethers } from 'ethers'

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
    };
  }
}


/**
 * @summary : this utility function connects to a wallet provider and returns the wallet, 
 * signer and provider or an error
 * @returns wallet, signer, & provider
 */
export const connectUserWallet = async (): Promise<any> => {
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







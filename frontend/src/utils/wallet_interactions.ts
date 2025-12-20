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

let browserProvider: ethers.BrowserProvider | null = null;
let readProvider: ethers.JsonRpcProvider | null = null;

export const connectUserWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  // Request accounts ONCE
  await window.ethereum.request({ method: "eth_requestAccounts" });

  if (!browserProvider) {
    browserProvider = new ethers.BrowserProvider(window.ethereum);
  }

  if (!readProvider) {
    readProvider = new ethers.JsonRpcProvider(
      import.meta.env.VITE_ALCHEMY_PROVIDER
    );
  }

  const signer = await browserProvider.getSigner();
  const wallet = (await signer.getAddress()).toLowerCase();

  return {
    provider: browserProvider,
    readProvider,
    signer,
    wallet
  };
};






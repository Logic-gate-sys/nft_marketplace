import axios from 'axios';
import { ethers } from 'ethers';

// Define types
interface WalletConnection {
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
  wallet: string;
}

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

// Connect wallet
export const connectWallet = async (): Promise<WalletConnection | undefined> => {
  try {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log('MetaMask detected');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const wallet = (await signer.getAddress()).toLowerCase();

    return { provider, signer, wallet };
  } catch (error) {
    console.error('Wallet connection failed', error);
    return;
  }
};

// User login
export const login = async (signer: ethers.JsonRpcSigner, wallet: string): Promise<void> => {
  try {
    // Get nonce from backend
    const { data } = await axios.get<NonceResponse>(
      `http://localhost:3000/api/users/nonce?address=${wallet}`
    );
    console.log('Nonce data:', data);

    // Sign message
    const signature = await signer.signMessage(data.message);
    console.log('Signature:', signature);

    const res = await axios.post<BackendResponse>(
      `http://localhost:3000/api/users/wallet_connect`,
      {
        address: wallet,
        message: data.message,
        signature,
      }
    );

    console.log('Backend response:', res.data);

    if (!res.data.success) {
      alert('Wallet connect failed');
      return;
    }

    alert('Wallet connected successfully');
  } catch (err) {
    console.error('Wallet connect failed', err);
    alert('Something went wrong, wallet not connected');
  }
};

// Fetch user ID
export const fetchUserId = async (wallet_addr: string): Promise<string | undefined> => {
  try {
    if (!wallet_addr) {
      console.error("No wallet found");
      return;
    }

    const { data } = await axios.get<{ id: string }>(
      `http://localhost:3000/api/users/wallet/${wallet_addr}`
    );

    if (!data) {
      console.log("No user id found for wallet", wallet_addr);
      return;
    }

    return data.id;
  } catch (error) {
    console.error(error);
    return;
  }
};

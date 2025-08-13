import { ethers } from 'ethers';
import axios from 'axios';
import abi from './abi.json' assert{type: 'json'};
import.meta.env.VITE_COLLECTION_FACTORY_ADDRESS;

/*
ORDER OF INTERACTIONS:
1. login with wallet address via metamusk should only allow users to view their collections
2. Explicit mint-button click should trigger metamusk signing and subsequent gas +/ fee payment authorisation
2. Explicit list should prompt metamust for signing and appropriate gas payment to list
4. Explicit buy operation should trigger metamust signer for payment authorisation
5. Explicity unlisting of nft should also trigger metamusk for approval and gas payment
6. Log appropriate events / errors involved in signed transactions
*/


export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }
    console.log('MetaMask detected');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const wallet = (await signer.getAddress()).toLowerCase();
    
    console.log('Wallet address:', wallet);
    return { provider, signer,  wallet };
  } catch (error) {
    console.log('Wallet connection failed', error);
  }
    // setAddress(userWalletAddress); // Only if setAddress is defined
}

// for transactions involving a signer
export const write_to_contract = async (signer) => {
  try {
    //contract instance 
    const contract = new ethers.Contract(import.meta.env.COLLECTION_FACTORY_ADDRESS, abi, signer); // get contract object 

    return contract;
  } catch (error) {
    console.log("Could not get contract instance", error);
    return;
  }
}

// reading blockchain state 
export const read_from_contract = async (provider) => {
  try {
    //contract instance 
    const contract = new ethers.Contract(import.meta.env.COLLECTION_FACTORY_ADDRESS, abi, provider); // get contract object 

    return contract;
  } catch (error) {
    console.log("Could not get contract instance", error);
    return;
  }
}


//user login
export const login = async (signer,wallet) => {
  try {
    // nonce message
  const { data } = await axios.get(`http://localhost:3000/api/users/nonce?address=${wallet}`);
    console.log('Nonce data:', data);
// get signature 
    const signature = await signer.signMessage(data.message);
    console.log('Signature:', signature);

    const res = await axios.post(`http://localhost:3000/api/users/wallet_connect`, {
      address: wallet,
      message: data.message,
      signature: signature
    });

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
}
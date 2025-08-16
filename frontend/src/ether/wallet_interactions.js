import axios from 'axios';
import { ethers } from 'ethers';



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


//user login
export const login = async (signer, wallet) => {
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

// get user id 
export const fetchUserId = async (wallet_addr) => {
    try {
      if (!wallet_addr) console.error("No wallet found");
      const { data } = await axios.get(
        `http://localhost:3000/api/users/wallet/${wallet_addr}`
      );
      // if user is not found
      if (!data) {
        console.log("No user id found for wallet", wallet_addr);
        return;
      }
      const { id } = data;
      console.log("USER ID FOUND : ", id);
      // set user id
      return id ;
    } catch (error) {
      console.log(error);
      return;
    }
  };
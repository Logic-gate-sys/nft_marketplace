 import React, { useState } from 'react';
 import axios from 'axios';
 import { ethers } from 'ethers';
 


// popup for custom messages 
export const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-xl w-80">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Loading/ Loader 
export const Spinner =() => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-100 bg-gray-500 opacity-60">
            <div className="  w-24 h-24 border-8 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
       
   )
}


export const connectWallet = async () => {
  try {
    console.log('Starting wallet connect...');

    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }

    console.log('MetaMask detected');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userWalletAddress = (await signer.getAddress()).toLowerCase();

    console.log('Wallet address:', userWalletAddress);
    // setAddress(userWalletAddress); // Only if setAddress is defined

    const { data } = await axios.get(`http://localhost:3000/api/users/nonce?address=${userWalletAddress}`);
    console.log('Nonce data:', data);

    const signature = await signer.signMessage(data.message);
    console.log('Signature:', signature);

    const res = await axios.post(`http://localhost:3000/api/users/wallet_connect`, {
      address: userWalletAddress,
      message: data.message,
      signature: signature
    });

    console.log('Backend response:', res.data);

    if (!res.data.success) {
      alert('Wallet connect failed');
      return;
    }

    alert('Wallet connected successfully');
    return userWalletAddress;

  } catch (err) {
    console.error('Wallet connect failed', err);
    alert('Something went wrong, wallet not connected');
  }
};

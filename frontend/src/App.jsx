
import { Routes, Route } from 'react-router-dom';
import { MarketPlace,Home, NFTDetails, UploadPage, Profile} from './pages';
import Nav from './components/Nav';
import SignUp from './components/SignUp';
import WalletsConnect from './components/WalletConnect'
import { Avatar } from 'antd';
import avatar from './assets/avatar.svg'; 
import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';




function App() {
  // hold address 
    const [address, setAddress] = useState("");

    // whole wallet connect mechanism
  const connetWallet = async () => {
  try {
    console.log('Starting wallet connect...');

    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }

    console.log('MetaMask detected');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userWalletAddress = await signer.getAddress();

    console.log('Wallet address:', userWalletAddress);
    setAddress(userWalletAddress);

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
    } else {
      alert('Wallet connected successfully');
    }
  } catch (err) {
    console.error('Wallet connect failed', err);
    alert('Something went wrong, wallet not connected');
  }
};

  
  return (
    <div id="app-page" className=' h-screen text-sm font-ubuntu text-white grid grid-cols-1 md:grid-cols-[0.2fr_5fr] bg-black'>
      <div id="sibe-bar" >
        <Nav/>
      </div>
      <div id="main" className='bg-[#1D1932] flex flex-col  gap-5 p-2 pl-8'>
          <div id="semi-nav" className='flex justify-center ml-auto pl-3 pr-3 gap-3'>
          <input type='search' placeholder="Search" className='self-center text-sm font-semibold w-18 focus:w-48 h-7 rounded-2xl border-1 text-end'/>
          <button className='h-10 pl-1 pr-1 font-semibold rounded-xl w-max hover:bg-blue-600 active:scale-95' onClick={connetWallet}>{address?`${address.slice(0,8)}....`  :'Connect Wallet'}</button>
                     <Avatar  
                           shape="circle"
                           src={avatar}
                           className='active:scale-95'
                    />
          </div>
        <div id="main">
        <Routes>
          <Route path='/' element={<Home />} />
            <Route path='/nft-market' element={<MarketPlace />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/wallet' element={<WalletsConnect />} />
            <Route path='/upload' element={<UploadPage />} />
            <Route path='/nft-details/:id' element={<NFTDetails />} />
            <Route path='/profile' element={<Profile />} /> 
        </Routes>
        </div>
      </div>
    </div>
  )
}
export default App;

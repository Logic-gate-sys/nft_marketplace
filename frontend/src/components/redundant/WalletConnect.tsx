import { useState } from 'react';
import Icon from '../assets/Wconnect.png';
import { UserOutlined } from '@ant-design/icons';
import MetaMusk from '../assets/Metamask.svg';
import WalletConnect from '../assets/WalletConnect.svg';
import CoinBase from '../assets/Coinbase.svg';
import { ethers } from 'ethers';
import axios  from 'axios';

/*
Connects to MetaMask

Gets the user’s wallet address

Fetches a message from the backend to sign

Lets the user sign that message

Sends the signed message to backend for verification
*/

const WalletsConnect = () => {
    // hold address 
    const [address, setAddress] = useState("");

    // whole wallet connect mechanism
    const connetWallet = async () => {
        //check if metamusk is installed  as a browser extension
        if (!window.ethereum) {
            alert('MetaMusk is not install as a browser extention,Please install to continue ');
            return;
        }
        // what's the wallet address
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(); // get who signs
        const userWalletAddress = await signer.getAddress();
        setAddress(userWalletAddress); //set address to signer address
    
        // verification address owner
        const { data } = await axios.get(`http://localhost:3000/nonce?address=${address}`);
        //get user's signature
        const signature = await signer.signMessage(data.message);
   
        // address + message + signature is send to the backend for verification
        const res = await axios.post(`http://localhost:3000/wallet_login`, {
            address: userWalletAddress,
            message: data.message,
            signature: signature
        })
    
        // is verification successful
        if (res.data.success) {
            alert('Wallet connect successfully');
        } else {
            alert('Invalid user details provided, try again');
        }
    }

    const [login, setLogin] = useState(false);
    return (
        <>
            <div id="wallet-connect-contatainer" className='m-auto grid md:grid-cols-[_1.8fr_2fr] text-white shadow-2xl'>
                <div id="image">
                    <img src={Icon} alt="Login image"/>
                </div>
                <div id="wallets-containter" className='bg-[#101111] shadow-2xl flex flex-col gap-5 p-5'>
                    <h1 className='text-3xl font-extrabold'>Connect Wallet</h1>
                    <p className='font-semibold gap-2'>Choose a wallet you want to connect. There are several wallet providers</p>
                    <button className=' w-56 font-semibold flex items-center justify-start pl-5 gap-2 border-[#A259FF] border-1 p-1 rounded-2xl hover:bg-[#3B3B3B]' onClick={connetWallet}><img src={MetaMusk} /> MetaMusk</button>
                    <button className=' w-56 font-semibold flex items-center justify-start pl-5 gap-2 border-[#A259FF] border-1 p-1 rounded-2xl hover:bg-[#3B3B3B]'><img src={WalletConnect} />Wallet Connect</button>
                    <button className=' w-56 font-semibold flex items-center justify-start pl-5 gap-2 border-[#A259FF] border-1 p-1 rounded-2xl hover:bg-[#3B3B3B]'><img src={CoinBase} />CoinBase</button>
                </div>
            </div>
        </>
    )
}


export default WalletsConnect;
import { useState } from 'react';
import Icon from '../assets/Wconnect.png';
import { UserOutlined } from '@ant-design/icons';
import MetaMusk from '../assets/Metamask.svg';
import WalletConnect from '../assets/WalletConnect.svg';
import CoinBase from '../assets/Coinbase.svg';

const WalletsConnect = () => {
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
                    <button className=' w-56 font-semibold flex items-center justify-start pl-5 gap-2 border-[#A259FF] border-1 p-1 rounded-2xl hover:bg-[#3B3B3B]'><img src={MetaMusk} /> MetaMusk</button>
                    <button className=' w-56 font-semibold flex items-center justify-start pl-5 gap-2 border-[#A259FF] border-1 p-1 rounded-2xl hover:bg-[#3B3B3B]'><img src={WalletConnect} />Wallet Connect</button>
                    <button className=' w-56 font-semibold flex items-center justify-start pl-5 gap-2 border-[#A259FF] border-1 p-1 rounded-2xl hover:bg-[#3B3B3B]'><img src={CoinBase} />CoinBase</button>
                </div>
            </div>
        </>
    )
}


export default WalletsConnect;

import { Routes, Route } from 'react-router-dom';
import { MarketPlace,Home, NFTDetails, UploadPage, Profile} from './pages';
import Nav from './components/Nav';
import { Link } from 'react-router-dom';
import { UserOutlined, BellOutlined,SearchOutlined } from '@ant-design/icons';
import SignUp from './components/SignUp';
import WalletsConnect from './components/WalletConnect'
import { Avatar } from 'antd';
import avatar from './assets/avatar.svg'; 

function App() {
  return (
    <div id="app-page" className=' h-screen text-sm font-ubuntu text-white grid grid-cols-1 md:grid-cols-[0.2fr_5fr] bg-black'>
      <div id="sibe-bar" >
        <Nav/>
      </div>
      <div id="main" className='bg-[#1D1932] flex flex-col  gap-5 p-2 pl-8'>
          <div id="semi-nav" className='flex justify-center ml-auto pr-3 glap-3'>
          <input type='search' placeholder="Search" className='self-center text-sm font-semibold w-18 focus:w-48 h-7 rounded-2xl border-1 text-end'/>
                    <Link to='/wallet'><button className='h-10 pl-1 pr-1 font-semibold rounded-xl w-max hover:bg-blue-600 active:scale-95'> Wallet</button></Link>
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

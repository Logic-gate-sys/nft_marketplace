
import { Routes, Route } from 'react-router-dom';
import { MarketPlace,Home} from './pages';
import Nav from './components/Nav';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import avatar from './assets/avatar.svg'; 

function App() {
  return (
    <div id="app-page" className=' h-screen w-screen text-white grid grid-cols-1 md:grid-cols-[0.2fr_5fr] bg-black'>
      <div id="sibe-bar">
        <Nav/>
      </div>
      <div id="main" className='bg-black flex flex-col gap-5 p-6'>
        <div id="semi-nav" className='ml-auto flex gap-4 justify-end'>
          <button className='bg-blue-600 p-1 rounded-xl w-max h-10 text-center tracking-wide self-center active:scale-95'><UserOutlined/>sign up</button>
          <button className='rounded-xl w-max h-10 font-normal hover:bg-blue-600 pl-1 pr-1 active:scale-95'>Connect Wallet</button>
          <BellOutlined className='self-start text-3xl active:scale-95'/>
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
        </Routes>
        </div>
      </div>
    </div>
  )
}
export default App;

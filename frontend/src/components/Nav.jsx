import { React,useState } from 'react';
import Logo from '../assets/logo.svg';
import { Typography } from 'antd';
import { FileOutlined,UserOutlined,SettingOutlined,MenuOutlined,HomeOutlined,AppstoreOutlined,QuestionCircleOutlined, QuestionOutlined, AppstoreAddOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Text ,Title,} = Typography;

 
const Nav = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [mouseOnIt, setMouseOnIt] = useState(false);

    // opening the menubar on smaller screens
    const openNav = () => {
        setIsMobile(isMobile => !isMobile);
    }
    return (
        <nav id='nav-container' className={!isMobile ? '' : 'h-full'}>
            <div id="mobile-view-nav" className='md:hidden flex items-center'>
                <div id="menu-and-logo" className='md:hidden mr-auto  flex gap-1 items-center'>
                    <MenuOutlined className='p-3 text-3xl active:scale-95' onClick={openNav} />
                    <img src={Logo} rel='logo' height={40} width={40} />
                    <h1 className='text-white font-extrabold'>Mint-Muse</h1>
                </div>
                <div id="profile-sign-up" className='mr-3 flex gap-2'>
                    <button className='font-bold p-1 outline-0 border-0 rounded-lg bg-blue-600 active:scale-90'>My wallet</button>
                    <UserOutlined className='text-2xl p-2 rounded-[100%] bg-gray-200 text-center'/>
                </div>
                {isMobile && 
                    <div id="mobile-menus" className='absolute top-13 md:hidden'>
                        <div id="menu-contens" className='h-[55rem] w-64 bg-gray-900 flex flex-col gap-5'>
                            <div id="home" className='flex gap-1.5 items-center rounded-xs hover:bg-gray-500/50'>
                                <HomeOutlined className='text-xl p-3' />
                                <Link to='/' onClick={()=>setIsMobile(false)} className='text-xl'>Home</Link>
                            </div>
                            <div id="market" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <AppstoreOutlined className='text-xl p-3' />
                                <Link to='/nft-market' onClick={() => setIsMobile(false)} className='text-xl'>Market Place</Link>
                            </div>
                            <div id="upload" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <FileOutlined className='text-xl p-3' />
                               <Link to='/upload' onClick={() => setIsMobile(false)} className='text-xl'>Upload/Mint</Link>
                            </div>
                            <div id="profile" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <UserOutlined className='text-xl p-3' />
                                <Link to='/profile' onClick={() => setIsMobile(false)} className='text-xl'>Profile</Link>
                            </div>
                            <div id="settings" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <SettingOutlined className='text-xl p-3' />
                                <Link to='/settings' onClick={() => setIsMobile(false)} className='text-xl'>Settings</Link>
                            </div>
                            <div id="faqs" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <QuestionOutlined className='text-xl p-3' />
                               <Link to='/faqs' onClick={() => setIsMobile(false)} className='text-xl'>FAQs</Link>
                            </div>
                        </div> 
                    </div>  
            }
            </div>
            <div id="desktop-view" className='hidden md:h-screen md:w-max md:bg-gray-900 md:flex flex-col p-2 text-white shadow-3xl'
                onMouseEnter={() => setMouseOnIt(true)} onMouseLeave={() => setMouseOnIt(false)}>
                    <div id="menu-contents" className='mt-8 mb-auto flex flex-col gap-3 font-bold'>
                            <div id="logo" className='flex gap-1 items-center'>
                              <img src={Logo} rel='logo' height={30} width={30} className='p-1' />
                              <h1 level={3} className={mouseOnIt?'text-md font-bold':'hidden'}>Mint-Muse</h1>
                          </div>
                          <div id="home" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50 '>
                                <HomeOutlined className='text-lg p-3' />
                        <Link to='/' onClick={()=>setMouseOnIt(false)}  className={mouseOnIt?'text-md':'hidden' }>Home</Link>
                            </div>
                            <div id="market" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <AppstoreOutlined className='text-lg p-3' />
                        <Link to='/nft-market' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Market Place</Link>
                            </div>
                            <div id="upload" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <FileOutlined className='text-lg p-3' />
                               <Link to='/upload' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Upload/Mint</Link>
                            </div>
                            <div id="profile" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <UserOutlined className='text-lg p-3' />
                                <Link to='/profile' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Profile</Link>
                            </div>
                            <div id="settings" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <SettingOutlined className='text-lg p-3' />
                                <Link to='/settings' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Settings</Link>
                            </div>
                            <div id="faqs" className='flex gap-1 items-center rounded-xs hover:bg-gray-500/50'>
                                <QuestionOutlined className='text-lg p-3' />
                               <Link to='/faqs' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>FAQs</Link>
                         </div>
                </div>

            </div>
    </nav>
    );
     
}
 


export default Nav;
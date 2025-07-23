import { React,useState } from 'react';
import Logo from '../assets/logo.svg';
import { Typography } from 'antd';
import { FileOutlined,UserOutlined,SettingOutlined,MenuOutlined,HomeOutlined,AppstoreOutlined,QuestionCircleOutlined, QuestionOutlined, AppstoreAddOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Text, Title, } = Typography;

 
const Nav = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [mouseOnIt, setMouseOnIt] = useState(false);

    // opening the menubar on smaller screens
    const openNav = () => {
        setIsMobile(isMobile => !isMobile);
    }
    return (
        <nav id='nav-container' className={!isMobile ? 'sticky' : 'h-full sticky'}>
            <div id="mobile-view-nav" className='flex items-center md:hidden'>
                <div id="menu-and-logo" className='flex items-center gap-1 mr-auto md:hidden'>
                    <MenuOutlined className='p-3 text-3xl active:scale-95' onClick={openNav} />
                    <img src={Logo} rel='logo' height={30} width={30} />
                    <h1 className='font-extrabold text-white'>Mint-Muse</h1>
                </div>
                {isMobile && 
                    <div id="mobile-menus" className='absolute top-13 md:hidden z-990'>
                        <div id="menu-contens" className='h-[55rem] w-64 bg-gray-900 flex flex-col gap-5'>
                            <div id="home" className='flex gap-1.5 items-center rounded-xs hover:bg-gray-500/50'>
                                <HomeOutlined className='p-3 text-xl' />
                                <Link to='/' onClick={()=>setIsMobile(false)} className='text-xl'>Home</Link>
                            </div>
                            <div id="market" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <AppstoreOutlined className='p-3 text-xl' />
                                <Link to='/nft-market' onClick={() => setIsMobile(false)} className='text-xl'>Discover</Link>
                            </div>
                            <div id="upload" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <FileOutlined className='p-3 text-xl' />
                               <Link to='/upload' onClick={() => setIsMobile(false)} className='text-xl'>Upload/Mint</Link>
                            </div>
                            <div id="profile" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <UserOutlined className='p-3 text-xl' />
                                <Link to='/profile' onClick={() => setIsMobile(false)} className='text-xl'>Profile</Link>
                            </div>
                            <div id="settings" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <SettingOutlined className='p-3 text-xl' />
                                <Link to='/settings' onClick={() => setIsMobile(false)} className='text-xl'>Settings</Link>
                            </div>
                            <div id="faqs" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <QuestionOutlined className='p-3 text-xl' />
                               <Link to='/faqs' onClick={() => setIsMobile(false)} className='text-xl'>FAQs</Link>
                            </div>
                        </div> 
                    </div>  
            }
            </div>
            <div id="desktop-view" className='flex-col hidden p-2 text-white md:h-screen md:w-max md:bg-gray-900 md:flex shadow-3xl'
                onMouseEnter={() => setMouseOnIt(true)} onMouseLeave={() => setMouseOnIt(false)}>
                    <div id="menu-contents" className='flex flex-col gap-3 pt-2 mb-auto font-bold'>
                            <div id="logo" className='flex items-center gap-1'>
                              <img src={Logo} rel='logo' height={30} width={30} className='p-1' />
                              <h1 level={3} className={mouseOnIt?'text-md font-bold':'hidden'}>Mint-Muse</h1>
                          </div>
                          <div id="home" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50 '>
                                <HomeOutlined className='p-3 text-lg' />
                        <Link to='/' onClick={()=>setMouseOnIt(false)}  className={mouseOnIt?'text-md':'hidden' }>Home</Link>
                            </div>
                            <div id="market" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <AppstoreOutlined className='p-3 text-lg' />
                        <Link to='/nft-market' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Discover</Link>
                            </div>
                            <div id="upload" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <FileOutlined className='p-3 text-lg' />
                               <Link to='/upload' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Studio</Link>
                            </div>
                            <div id="profile" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <UserOutlined className='p-3 text-lg' />
                                <Link to='/profile' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Profile</Link>
                            </div>
                            <div id="settings" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <SettingOutlined className='p-3 text-lg' />
                                <Link to='/settings' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>Settings</Link>
                            </div>
                            <div id="faqs" className='flex items-center gap-1 rounded-xs hover:bg-gray-500/50'>
                                <QuestionOutlined className='p-3 text-lg' />
                               <Link to='/faqs' onClick={() => setMouseOnIt(false)} className={mouseOnIt?'text-md':'hidden'}>FAQs</Link>
                         </div>
                </div>

            </div>
    </nav>
    );
     
}
 


export default Nav;
import { useState } from 'react';
import Icon from '../assets/for-login.png';
import { UserOutlined } from '@ant-design/icons';

const SignUp = () => {
    const [login, setLogin] = useState(false);
    return (
        <>
            <div id="signup-container" className='  grid md:grid-cols-[_1.8fr_2fr] text-white'>
                <div id="image">
                    <img src={Icon} alt="Login image"/>
                </div>
                <div id="input-containter" className='bg-[#101111] shadow-2xl flex flex-col gap-5 p-5'>
                    <h1 className='text-3xl font-extrabold'>{!login? "Create Account":"Login"}</h1>
                    <p className='font-semibold'>{!login? "Welcome! Enter Your Details And Start Creating, Collecting And Selling NFTs.":"Welcome Back , Enter Your Details To Login "}</p>
                    <form className='flex flex-col gap-6'>
                        <div id="inputs" className='flex flex-col gap-3'>
                        <input type="text" placeholder='Username'  className={login? "hidden":"bg-white text-[#101111] rounded-xl p-2 font-semibold"}/>
                        <input type="email" placeholder='Email Address' className='bg-white text-[#101111] rounded-xl p-2 font-semibold'/>
                        <input type="password" placeholder='Password' className='bg-white text-[#101111] rounded-xl p-2 font-semibold'/>
                        <input type="password" placeholder='Confirm Password' className={login? "hidden":"bg-white text-[#101111] rounded-xl p-2 font-semibold"} />
                       </div>
                        <button type='submit' className='bg-[#A259FF] text-[#101111] rounded-xl p-2 font-semibold active:cursor-progress'>{login?"Login":"Create account"}</button>
                    </form>
                    {!login &&
                    <p>Already Have An Account? <button className='text-[#C4EBFF] p-2 active:scale-95  cursor-pointer'  onClick={()=>setLogin(!login)}>Login</button></p>
                     }
                </div>
            </div>
        </>
    )
}


export default SignUp;
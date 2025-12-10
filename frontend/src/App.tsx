import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Avatar } from "antd";
import { Explore, Studio, MarketPlace } from "./pages";
import avatar from './assets/avatar.svg';
import { connectUserWallet } from "./utils/wallet_interactions";
import { createUser, login } from "./services/auth";
import { Nav, PopupMessageBox } from "./components";
import { useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  // implement protected routes later for upload, setting and dashboard
  const [connected, setConnected] = useState<boolean>(false);
  const { wallet, user, connectWallet } = useAuth();
  // User ID from backend
  const message = `Wallet connection successful !, 
                   Close this button to continue `;

  //----------------------  Wallet connect handler
  
  const handleWalletConnect = async (): Promise<void> => {
    try {
      // connect walleta && retrieve signer, and walletAddress
      const { signer, provider, wallet } = await connectUserWallet();
      if (!wallet) {
        console.log('Could not retrieve walleta address ');
        return;
      }
      //fetch user id
      let {acessToken, user} = await login(wallet);
      //if user does not exit create one and return it's id
      console.log("Token: ", acessToken);
      if (acessToken.isNull) {
        user = await createUser(wallet);
        if (!user) {
          console.error("Could not create new user");
          return;
        }
        console.log("USER RETURNED : ", user);
      }
      // Set address & and user id
      connectWallet(wallet, signer, provider, user, acessToken); 
      setConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div
      id="app-page"
      className="h-screen text-md font-sans text-white grid grid-cols-1 md:grid-cols-[0.2fr_5fr] bg-gray-800"
    >
      {/*----------------------------- Sidebar -------------------------------------------------*/}
      <div id="side-bar">
        <Nav />
      </div>

      {/*----------------------------- Main content -----------------------------------------*/}
      <div
        id="main"
        className="bg-[#1D1932] h-screen overflow-y-auto flex flex-col gap-2 pl-2"
      >
        {/* Top bar */}
        <div
          id="semi-nav"
          className=" flex justify-center ml-auto pl-3 pr-3 gap-3"
        >
          <input
            type="search"
            placeholder="Search"
            className="self-center text-sm font-semibold w-18 focus:w-48 h-7 rounded-2xl border-1 text-end"
          />
          <button
            className="h-10 pl-1 pr-1 font-semibold rounded-xl w-max hover:bg-blue-600 active:scale-95"
            onClick={handleWalletConnect}
          >
            {wallet ? `${wallet.slice(0, 8)}....` : "Connect Wallet"}
          </button>
          <Avatar shape="circle" src={avatar} className="active:scale-95" />
        </div>

        {/* Routes */}
        <div id="main">
          <Routes>
            {/* <Route path="/" element={<Explore />} /> */}
            {/* <Route path="/nft-market" element={<MarketPlace />} /> */}
            {/* <Route path="/studio" element={<Studio userId={user?.id} handleWallectConnect={handleWalletConnect} />} /> */} 
            {/* <Route path="/dashboard" element={<Studio userId={userId} handleWallectConnect={handleWalletConnect} />} /> */}
          </Routes>
        </div>
      </div>
      {connected && <PopupMessageBox message={message} onClose={()=>setConnected(false)}/>}
    </div>
  );
};

export default App;

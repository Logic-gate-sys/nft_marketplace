import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { MarketPlace, Home, NFTDetails, UploadPage, Profile } from "./pages";
import Nav from "./components/Nav";
import { Avatar } from "antd";
import avatar from "./assets/avatar.svg";
import { useState } from "react";
import { connectWallet,login,fetchUserId } from "./ether/wallet_interactions";

const App = () => {
  // hold address
  const [address, setAddress] = useState("");
  const [user_id, setUserid] = useState(null);
  // whole wallet connect mechanism

  const handleWallectConnect = async () => {
    try {
      const { signer, wallet } = await connectWallet();
      if (!wallet) return; //......
      //login
      await login(signer, wallet);
      //on sucessful login
      setAddress(wallet);
      const id = await fetchUserId(wallet);
      setUserid(id);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  };



  return (
    <div
      id="app-page"
      className=" h-screen text-md font-sans text-white grid grid-cols-1 md:grid-cols-[0.2fr_5fr] bg-gray-800"
    >
      <div id="sibe-bar">
        <Nav />
      </div>
      <div
        id="main"
        className="bg-[#1D1932] h-screen overflow-y-auto flex flex-col  gap-5 p-2 pl-8"
      >
        <div
          id="semi-nav"
          className="flex justify-center ml-auto pl-3 pr-3 gap-3"
        >
          <input
            type="search"
            placeholder="Search"
            className="self-center text-sm font-semibold w-18 focus:w-48 h-7 rounded-2xl border-1 text-end"
          />
          <button
            className="h-10 pl-1 pr-1 font-semibold rounded-xl w-max hover:bg-blue-600 active:scale-95"
            onClick={handleWallectConnect}
          >
            {address ? `${address.slice(0, 8)}....` : "Connect Wallet"}
          </button>
          <Avatar shape="circle" src={avatar} className="active:scale-95" />
        </div>
        <div id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nft-market" element={<MarketPlace />} />
            <Route path="/upload" element={<UploadPage id={user_id} />} />
            <Route path="/nft-details/:id" element={<NFTDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
export default App;

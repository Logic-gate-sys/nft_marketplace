import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Avatar } from "antd";
import { Home, UploadPage, MarketPlace } from "./pages";
import Nav from "./components/layout/Nav";
import avatar from './assets/avatar.svg';
import { connectWallet, login, fetchUserId } from "./ether/wallet_interactions";

const App: React.FC = () => {
  // Wallet address
  const [address, setAddress] = useState<string>("");
  // User ID from backend
  const [userId, setUserId] = useState<string>("");

  // Wallet connect handler
  const handleWalletConnect = async (): Promise<void> => {
    try {
      const connection = await connectWallet();
      if (!connection) return;

      const { signer, wallet } = connection;

      // Login with wallet
      await login(signer, wallet);

      // Set address and fetch user ID
      setAddress(wallet);
      const id = await fetchUserId(wallet);
      if (id) setUserId(id);

    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div
      id="app-page"
      className="h-screen text-md font-sans text-white grid grid-cols-1 md:grid-cols-[0.2fr_5fr] bg-gray-800"
    >
      {/* Sidebar */}
      <div id="side-bar">
        <Nav />
      </div>

      {/* Main content */}
      <div
        id="main"
        className="bg-[#1D1932] h-screen overflow-y-auto flex flex-col gap-5 p-2 pl-8"
      >
        {/* Top bar */}
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
            onClick={handleWalletConnect}
          >
            {address ? `${address.slice(0, 8)}....` : "Connect Wallet"}
          </button>
          <Avatar shape="circle" src={avatar} className="active:scale-95" />
        </div>

        {/* Routes */}
        <div id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nft-market" element={<MarketPlace />} />
            <Route path="/upload" element={<UploadPage userId={userId} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

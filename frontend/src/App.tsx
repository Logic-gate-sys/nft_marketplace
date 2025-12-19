import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { Explore, Studio, MarketPlace, CollectionView } from "./pages";
import avatar from "./assets/avatar.svg";
import { connectUserWallet } from "./utils/wallet_interactions";
import { createUser, login } from "./services/auth";
import { Nav, PopupMessageBox } from "./components";
import { useAuth } from "./context/AuthContext";
import StudioCollectionView from "./pages/collection_view/StudioCollectionView";
import { ConsoleSqlOutlined } from "@ant-design/icons";

const App: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const { wallet, user, connectWallet, token } = useAuth();

  const message = `Wallet connection successful! Close this button to continue`;
  useEffect(() => {
    console.log("ACESS TOKEN FROM AUTH", token);
  }, [token]);

  const handleWalletConnect = async (): Promise<void> => {
    try {
      // retrieve ethers details
      const { readProvider, provider, signer, wallet } = await connectUserWallet();
      console.log("READ ALCHEMY PROVIDER ", readProvider);
      if (!wallet) {
        console.log("Could not retrieve wallet address");
        return;
      }

      // try creating user first :
      const res = await createUser(wallet);
      if (res.reason == "bad_request") {
        console.log("Could not create user !, bad request");
        return;
      } else if (res.reason === "duplicate") {
        console.log("User already exist ");
        // login rather
        let { acessToken, user } = await login(wallet);
        console.log("ACESS TOKEN : ", acessToken);
        if (acessToken.isNull) {
          user = await createUser(wallet);
          if (!user) {
            console.error("Could not create new user");
            return;
          }
        }
        // assign Auth details
        connectWallet(wallet, signer, provider,readProvider,user, acessToken);
        setConnected(true);
      }
      // safely return
      setConnected(true);
      return;
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div className="h-screen flex bg-os-bg-primary">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col border-r border-os-border bg-os-bg-tertiary">
        <Nav />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-os-border bg-os-bg-tertiary px-4 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-os-bg-hover transition-colors">
              <svg
                className="w-6 h-6 text-os-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-os-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search collections and NFTs"
                className="input-search"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {!wallet ? (
              <button onClick={handleWalletConnect} className="btn-primary">
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {/* Wallet Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-os-bg-secondary rounded-xl border border-os-border">
                  <div className="w-2 h-2 bg-os-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-os-text-primary font-mono">
                    {wallet.slice(0, 6)}...{wallet.slice(-4)}
                  </span>
                </div>

                {/* Avatar */}
                <Avatar
                  shape="circle"
                  src={avatar}
                  className="avatar"
                  size={40}
                />
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-os-bg-primary">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/studio" element={<Studio />} />
            <Route
              path="/collection/:collectionId"
              element={<CollectionView />}
            />
            <Route
              path="/market/collection/:col_id"
              element={<CollectionView />}
            />
            <Route
              path="/studio/collection/:col_id"
              element={<StudioCollectionView />}
            />
          </Routes>
        </main>
      </div>

      {/* Popup Message */}
      {connected && (
        <PopupMessageBox
          message={message}
          onClose={() => setConnected(false)}
        />
      )}
    </div>
  );
};

export default App;

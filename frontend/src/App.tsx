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


type Message = {
  type:"error" | "success" | "warning" | "info" | undefined, 
  detail : string 
}

const App: React.FC = () => {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const { wallet, user, connectWallet, token } = useAuth();
  const [message, setMessage] = useState<Message>({ type: 'info', detail: 'Waiting' });


  const handleWalletConnect = async (): Promise<void> => {
    try {
      // retrieve ethers details
      const { readProvider, provider, signer, wallet } = await connectUserWallet();
      // console.log("READ ALCHEMY PROVIDER ", readProvider);
      if (!wallet) {
        setShowMessage(true)
         setMessage({type:'error', detail:'No wallet address found!'})
        return;
      }

      // try creating user first :
      const res = await createUser(wallet);
      const reason = res?.reason; 
      //switch
      switch (reason) {
        case 'bad_request':
          setShowMessage(true);
          setMessage({ type: 'error', detail: 'Could not create user !, bad request' })
          break;
        
        case 'duplicate':
          const { acessToken, user } = await login(wallet);
          console.log("USER : ", user);
            if (!user) {
              setShowMessage(true);
              setMessage({ type: 'error', detail: 'Error: Failed to login user' });
              break; 
             }
          // if login successful , connect
          connectWallet(wallet, signer, provider, readProvider, acessToken, user);
          setMessage({ type: 'success', detail: 'Success, wallet login successful' })
          setShowMessage(true);
          break; 
        
        case 'success':
          // assign Auth details
          connectWallet(wallet, signer, provider, readProvider, acessToken, user);
          setMessage({ type: 'success', detail: 'Success, wallet created successful' })
          setShowMessage(true);
          break; 
        
        default:
          setMessage({ type: 'warning', detail: 'Weird!. This is not supposed to happen' })
          setShowMessage(true);
      }
    } catch (err: any) {
      setMessage({ type: 'error', detail: `Error ${err.message}` })
      setShowMessage(true); 
      console.error("Wallet connection failed:", err);
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
      {showMessage && (
        <PopupMessageBox
          message={message.detail}
          type={message.type}
          onClose={() => setShowMessage(false)}
        />
      )}
    </div>
  );
};

export default App;

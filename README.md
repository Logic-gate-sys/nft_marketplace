# NFT Marketplace

Welcome to the NFT Marketplace project! This is a full-stack decentralized application (dApp) that allows users to mint, buy, sell, and manage NFTs (Non-Fungible Tokens) and collections. The project is organized into three main parts: the smart contracts, the backend API, and the frontend web application.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Smart Contracts](#smart-contracts)
- [Backend API](#backend-api)
- [Frontend](#frontend)
- [Development Guidelines](#development-guidelines)
- [Security](#security)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Project Structure
nft_marketplace/ │ ├── frontend/ # React-based web application ├── nft_contract/ # Solidity smart contracts (Foundry) ├── nft-marketplace-api/ # Node.js/Express backend API ├── README.md # Project overview (this file) └── ...


---

## Features

- **User Registration & Authentication:**  
  Users register with email, wallet address, and name. Login is via wallet address.

- **Wallet Integration:**  
  Users connect their crypto wallet to interact with the marketplace.

- **NFT Minting:**  
  Users can mint new NFTs by uploading their work (e.g., images) and metadata.

- **Collections:**  
  Users can create collections to organize their NFTs.

- **Marketplace:**  
  List NFTs for sale, buy NFTs, and participate in auctions.

- **Ownership & Transfers:**  
  Secure transfer of NFT ownership on-chain.

- **Admin Tools:**  
  Admins can manage users, NFTs, and handle reports or fraud.

- **Analytics:**  
  Track sales, volume, and user activity.

---

## How It Works

1. **User Onboarding:**  
   Users sign up and connect their wallet. The backend verifies wallet ownership.

2. **Minting NFTs:**  
   Users upload files (stored on IPFS) and metadata (stored in Postgres DB). The smart contract mints the NFT on-chain.

3. **Listing & Buying:**  
   Owners can list NFTs for sale. Buyers purchase NFTs using their wallet. Ownership is transferred on-chain and reflected in the backend.

4. **Collections:**  
   Users can group NFTs into collections, which can also be listed for sale or auctioned.

5. **Synchronization:**  
   The backend listens to blockchain events to keep the database in sync with on-chain data.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Foundry (for Solidity smart contract development)
- PostgreSQL (for backend database)
- IPFS node or pinning service (for file storage)
- MetaMask or compatible wallet (for testing)

### Setup Instructions

#### 1. Clone the Repository

```sh
git clone <repo-url>
cd nft_marketplace

2. Install Dependencies
 - Frontend:
  cd frontend
  npm install

 - backend: 
cd ../nft-marketplace-api
npm install

 - Smart Contract: 
 cd ../nft_contract
# Install Foundry if not already installed
foundryup

. Configure Environment Variables
Copy .env.example to .env in each subproject and fill in the required values (database URL, API keys, etc.).
4. Run the Application

Start Backend API:
cd nft-marketplace-api
npm start

- Deploy Smart contract (local): 
cd ../nft_contract
forge test
# or deploy to a testnet as needed

- Start frontend: 
cd ../frontend
npm run dev

Smart Contracts
Located in nft_contract/
Written in Solidity using Foundry
Main contracts:
Collection: Handles minting, selling, and storing NFTs in collections.
CollectionFactory: Deploys new collection contracts for users.
Uses OpenZeppelin Contracts for security and standards compliance.
Backend API
Located in nft-marketplace-api/
Node.js/Express server
Handles:
User authentication (JWT)
NFT metadata storage (Postgres)
File uploads to IPFS
Syncing with blockchain events
Business logic for minting, listing, buying, and transferring NFTs
Frontend
Located in frontend/
Built with React and Vite
Features:
Wallet connection (MetaMask, WalletConnect)
Minting UI
NFT and collection browsing
Listing and buying NFTs
User dashboard
Development Guidelines
Follow best practices for Solidity, Node.js, and React.
Write clear, maintainable code and document public interfaces.
Use pull requests and code reviews for all changes.
See OpenZeppelin Guidelines for smart contract best practices.

Security
Uses OpenZeppelin libraries for secure smart contract development.
Backend and frontend follow standard security practices (input validation, authentication, etc.).
Regular audits and bug bounties are recommended for production deployments.
License
The project uses the MIT License. See LICENSE for details.
Acknowledgements
OpenZeppelin for secure smart contract libraries.
Foundry for Solidity development tooling.
IPFS for decentralized file storage.
For more details, see the individual READMEs in each subproject:

Smart Contracts
Backend API
Frontend



## -------------------------- MAIN FRONTEND FEATURES -----------------------------------

1. Image carousal for useful information on top : in the market page such as
--- new collections
--- trending collections 
--- special collections 

2. When user profile is click :these features must be shown
- username? optional if user sets it || edit icon to rename 
- email? optional if user sets it   || edit icon to rename 
- avatar? optional if user sets it  || edit icon to change 

- account address 
- accont balance 

- nfts sold - list view / details show when nft is clicked
- nfts minted -list view 
- nfts bought - list view 

- suggested nfts you might be interested in 


// First thing in the homepage is the carousal:
- carousal(for nft collections) has :
 1. image -background
 2. Name of collection featured
 3. By : creator Wallet
 4. a card storing : floor-price , number-of-items, volume , %listed
 5. 3 nfts images in collection : onhover show details, onclick to to Details page

 -- the studio page should have two main things:
  1. section for minting new nfts 
  2. section for all works minted by the user in the past with three options on each:
    - list ( for sale )
    - delete ( remove from database and ipfs)
    - unlist (for work that's listed be needed to be taken down)
  # every functionality on this page would only be allowed with wallet connect and signs

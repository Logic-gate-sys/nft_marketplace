
#  NFT Marketplace
Welcome to the **NFT Marketplace** project!
This is a **full-stack decentralized application (dApp)** that allows users to **mint, buy, sell, and manage NFTs (Non-Fungible Tokens) and collections**.

The project is organized into three main parts:

1. **Smart Contracts** → Solidity contracts (via Foundry) for minting, collections, transfers.
2. **Backend API** → Node.js/Express with PostgreSQL + IPFS integration.
3. **Frontend** → React + Vite dApp with wallet connection.

---

##  Table of Contents

* [Project Structure](#-project-structure)
* [Features](#-features)
* [How It Works](#-how-it-works)
* [Getting Started](#-getting-started)

  * [Prerequisites](#prerequisites)
  * [Setup Instructions](#setup-instructions)
* [Smart Contracts](#-smart-contracts)
* [Backend API](#-backend-api)
* [Frontend](#-frontend)
* [Development Guidelines](#-development-guidelines)
* [Security](#-security)
* [Unique Selling Points](#-unique-selling-points)
* [Summary](#-summary)
* [License](#-license)
* [Acknowledgements](#-acknowledgements)

---

##  Project Structure

```
.
├── Dockerfile
├── README.md
├── backend
│   ├── node_modules
│   ├── nodemon.json
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma
│   ├── prisma.config.ts
│   ├── seed.sql
│   ├── src
│   └── tsconfig.json
├── frontend
│   ├── dist
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite-env.d.ts
│   └── vite.config.ts
├── seed.sql
└── shared
    ├── constants
    ├── schema.ts
    └── types
```

---

##  Features

* **User Registration & Authentication**

  * Register with email, wallet address, and name.
  * Login via wallet connection.

* **Wallet Integration**

  * MetaMask & wallet connect for interaction.

* **NFT Minting**

  * Upload images & metadata → stored on **IPFS**.
  * Mint NFT on-chain & sync backend DB.

* **Collections**

  * Create and manage collections.
  * Group NFTs and list them individually or as a set.

* **Marketplace**

  * List NFTs for sale or auction.
  * Buy NFTs using crypto.
  * Transfer ownership securely on-chain.

* **Admin Tools**

  * Manage users, NFTs, fraud reports.

* **Analytics**

  * Track sales, marketplace volume, and user activity.

---

##  How It Works

1. **User Onboarding**

   * Sign up with wallet + email.
   * Backend verifies ownership (nonce + signature).

2. **Minting NFTs**

   * File → uploaded to IPFS.
   * Metadata → stored in DB.
   * Smart contract mints NFT → updates backend.

3. **Listing & Buying**

   * Owners list NFTs.
   * Buyers purchase with crypto.
   * Ownership transferred on-chain & DB synced.

4. **Collections**

   * NFTs grouped into collections.
   * Can be listed or auctioned.

5. **Synchronization**

   * Backend listens to **blockchain events** (`Transfer`, `Minted`) to stay up-to-date.

---

##  Getting Started

###  Prerequisites

* Node.js (v18+)
* npm / yarn
* Foundry (for Solidity contracts)
* PostgreSQL
* IPFS node or pinning service (e.g., Pinata)
* MetaMask or compatible wallet

###  Setup Instructions

```sh
# Clone repository
git clone <repo-url>
cd nft_marketplace
```

#### Install Dependencies

* **Frontend**

  ```sh
  cd frontend
  npm install
  ```

* **Backend**

  ```sh
  cd ../nft-marketplace-api
  npm install
  ```

* **Smart Contracts**

  ```sh
  cd ../nft_contract
  foundryup
  ```

#### Configure Environment Variables

* Copy `.env.example` → `.env` in each subproject.
* Add keys (DB URL, API keys, IPFS keys, etc.).

#### Run the Application

```sh
# Backend API
cd nft-marketplace-api
npm start

# Smart Contracts (local test)
cd ../nft_contract
forge test

# Frontend
cd ../frontend
npm run dev
```

---

##  Smart Contracts

* Located in `nft_contract/`.
* Written in **Solidity** with Foundry.
* Uses **OpenZeppelin** for security.

Main contracts:

* **Collection.sol** → minting, selling, storing NFTs.
* **CollectionFactory.sol** → deploys collections per user.

---

## 🛠 Backend API

* Located in `nft-marketplace-api/`.
* Built with **Node.js + Express + PostgreSQL**.
* Responsibilities:

  * Authentication (JWT).
  * Metadata storage.
  * File uploads → IPFS.
  * Sync blockchain events.
  * Mint/list/buy/transfer logic.

---

##  Frontend

* Located in `frontend/`.
* Built with **React + Vite + TailwindCSS**.
* Features:

  * Wallet connection (MetaMask).
  * Minting UI.
  * NFT/Collection browsing.
  * User dashboard.
  * Market page with trending/new/special collections.

---

##  Development Guidelines

* Follow best practices (Solidity, Node.js, React).
* Document all public interfaces.
* Use PRs + reviews.
* Follow [OpenZeppelin guidelines](https://docs.openzeppelin.com/).

---

##  Security

* OpenZeppelin contracts for ERC-721, royalties.
* Standard backend security (JWT, input validation).
* Audit smart contracts before production.

---

##  Unique Selling Points

* NFTs come with **clear commercial licenses**.
* Unlockable **high-res files** only for owners.
* **Community perks** for holders (drops, collabs, discounts).
* **Verification tools** for provenance & ownership.
* **Royalty enforcement** on secondary sales.

Pitch:

> “On our marketplace, you’re not just buying an image.
> You’re buying **rights + provenance + unlockable utilities**.”

---

##  Summary

The backend services must:

1. **User Management**

   * Register/login via wallet.
   * JWT authentication.
   * Profile management.

2. **NFT Management**

   * Mint NFTs (metadata + IPFS).
   * List NFTs for sale.
   * Browse/filter NFTs.

3. **Buying & Transfers**

   * Atomic buy process (lock → pay → transfer).
   * Handle failures safely.

4. **Transactions & History**

   * Record all purchases/sales.
   * User transaction history.

5. **Blockchain Sync**

   * Listen to smart contract events.
   * Verify ownership against chain.

6. **Admin Tools**

   * Manage NFTs/users.
   * Force unlist & handle fraud.
   * Analytics (volume, sales, users).

---

##  License

This project is licensed under the **MIT License**.

---

##  Acknowledgements

* [OpenZeppelin](https://openzeppelin.com/) → Smart contract libraries.
* [Foundry](https://book.getfoundry.sh/) → Solidity toolkit.
* [IPFS](https://ipfs.tech/) → Decentralized storage.

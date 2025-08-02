# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




## -------------------------- Main Frontend Features -----------------------------------

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
  1. section for minting new nfts :
  2. section for all works minted by the user in the past with three options on each:
    - list ( for sale )
    - delete ( remove from database and ipfs)
    - unlist (for work that's listed be needed to be taken down)
  # every functionality on this page would only be allowed with wallet connect and signs

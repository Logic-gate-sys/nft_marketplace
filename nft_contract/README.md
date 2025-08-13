#THE NFT CONTRACT: 
This contract is design to serve among other things these cores purposes: 
1. Support dynamic minting: user should be able to upload their work(e.g. image) and mint into their own collection
2. Sell/ transfer of token ownership
3. Metadata storage and retrieval for the front-end 
4. removing an nft only-owner can remove
5.* Onchain modification of nfts: owner, price

2. There two contractions : 
  - Collection contract : this is the main logic for minting , selling and storing a collection 
  - CollectFactory contract: this depoys a clone of the Collection contract for each user that create a collection.

#Steps :
 - Achieve the creation of an nft
 - Interracting with the backedend, fronten smart contract to mint the nft and have it displayed for the minter and buyer with details including price
 - Interract with th smart contract, frontend and backend to allow nft transaction : buying/selling
 - Interract with smart contract to ensure each transaction is reflected in user's account balance
 - Make payment amounts for nfts both in eth and equivalent USD.
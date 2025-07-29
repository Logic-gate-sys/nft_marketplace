# Backend for the nft market place supports this functionalities :
1. User registrations and login validations
   i.  user register with email, wallet address and name
   ii. user logs in with wallet address (only) 

2. authentication & authorisation for admin user and customers 
   i. users(apart from the admin) need wallet address:
      i. wallet address is needed to acess their collections/nfts
      ii. wallet address is needed to acess key endpoints: 
              1. user dashboard (containing nfts/collections and performance)
              2. mint/upload to create nfts
              3. setting: updating user infos 

3. NFT-assert storage:
   i. meta-data stored in postgres
   ii. file store in a IPFS

4. Listing of all NFTs 
   ii. wallet address is needed to purchase  nft(s)
   i. An nft(s) can have no collections, in this way there are stored directly in a user_default collection
   ii. A single should have the functionality of being autioned and bought

  
5. Creation and storage of a collection
   i. all collections start-out being empty until an/ NFT(s) is minted and added to the collection *
   ii. user can create and store collections that contain one or more nfts *
   ii8. A collection can be aution for sale; this way all nfts in the collection appear on the market place *
   iv. only selected items in the collection can be autioned for sale . 

6. Switching / connecting to a wallet address : 
   i. a user needs to add a wallet address & an email to be registered in the system
   ii. a user can switch a wallet address if they already are registered:
      -- Switching wallet gives you acess to only nfts on that wallet ; except email & other user details like profile, name


-------------------- WHAT I'VE DONE ALREADY ----------------------
1. User registrations and login validations
   i.  user register with email, wallet address and name
   ii. user logs in with wallet address (only) 
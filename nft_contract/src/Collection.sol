// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


//Logic contract for how an nft collection should function
contract Collection is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    uint256 private s_tokenCounter;
    mapping(uint256 tokenId => string tokenURI) s_tokenIdToTokenURI;
    mapping(uint256 tokenId => uint128 amount) tokenIdToAmount;
   
    //error
    error Col_NotEnoughAmountToGetNFT();
    error Collection_NotOwner(address, address);
    error Collection_NotListedForSale();


    // intialise uses the modifier 'initiliser' to ensure initialise can only be call once
    function initialize(address owner, string memory name, string memory symbol) public initializer {
        s_tokenCounter = 0; // intial minted tokens
        __ERC721_init(name, symbol); // intialises an nft with name and symbol
        __Ownable_init(owner);
    }

    //mint
    function mint(string memory _tokenURI) public onlyOwner {
        // token URI is a combination image uri and metadata
        s_tokenIdToTokenURI[s_tokenCounter] = _tokenURI; // create new token
        _safeMint(msg.sender, s_tokenCounter); // mint token id to minter
        s_tokenCounter++; // increment counter after minting
    }
 
   // list for sale 
   function listForSale(uint256 token_id, uint128 price) public{
    if(msg.sender != ownerOf(token_id)){
       revert Collection_NotOwner(msg.sender, ownerOf(token_id));
    }
          tokenIdToAmount[token_id] = price ;
   }

   //function list for sale 
   function cancelListing(uint256 token_id) public {
      if(msg.sender != ownerOf(token_id)){
       revert Collection_NotOwner(msg.sender, ownerOf(token_id));
    }
    delete tokenIdToAmount[token_id]; // delete
   }

 function buy(uint256 _tokenId) public payable {
    if(tokenIdToAmount[_tokenId]==0){
        revert Collection_NotListedForSale();
    }
    address owner = ownerOf(_tokenId);
    require(msg.sender != owner, "Cannot buy your own NFT");

    uint256 price = tokenIdToAmount[_tokenId];
    require(price > 0, "NFT not for sale");
    require(msg.value >= price, "Not enough ETH sent");

    // Effects: remove listing before external call
    tokenIdToAmount[_tokenId] = 0;

    // Transfer NFT
    transferFrom(owner, msg.sender, _tokenId);

    // Interactions: send ETH to seller
    (bool success, ) = payable(owner).call{value: msg.value}("");
    require(success, "Payment to seller failed");
}

    
    // token uri
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToTokenURI[tokenId]; // return the stores uri
    }

    //base uri
    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }
    // expose total minted tokens in this collection

    function getTotalMintedTokens() public view returns (uint256) {
        return s_tokenCounter;
    }
    // ownership transher mush involve payment before transfer can happen
}

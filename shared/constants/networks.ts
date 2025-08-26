//SPDX-License-Identifier:MIT
pragma solidity^0.8.24;


import {IERC20} from "smart-contract/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "smart-contract/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "smart-contract/lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "smart-contract/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title NFT-MarketPlace
 * @author Daniel Kwasi Kpatamia  
 * @notice This contract is the main logic for market place application. This contract takes an ERC-20 token and the platform compliant
 *  token that is supported by all transactions. Buying,Selling,Listing of nfts on the marketplace incurs charges that are calculated and
 * transfered from the transaction initialisers account. 
 * @dev This contract expect USDC as the main token for transactions : passed to the constructor 
 * The marketplace has these main features that it supports :
 *   -Buying/Selling NFT
 *   -Listing/Unlisting NFT
 *   -Updating Listing
 */
contract MarketPlace is ReentrancyGuard{
    using SafeERC20 for IERC20; // safe 
    //------------------------------- custom errors --------------------------------------------
    error MarketPlace_NotOwnerOfNFT();
    error MarketPlace_NFTAlreadyListed(address tokenAddress, uint256 tokenId);
    error MarketPlace_CannotBuyYourOwnNFT();
    error MarketPlace_NFT_Transfer_Failed();
    error MarketPlace_NoTEnoughRevenue();
    error MarketPlace_NFTNotListed(address _nftAddress,uint256 _tokenId);
    error MarketPlace_ListingPriceMustBeGreaterThanZero();

    //----------------------------- types ------------------------------------------------------
     struct Listing{
        uint256 _price;
        address _seller;
     }

    //------------------------------ state variables -------------------------------------------
    IERC20 s_paymentToken;
    mapping(address nftAddress => mapping(uint256 tokenId => Listing listing)) s_nftListings;
    mapping(address _user => uint256 _revenue) s_user_revenue;

    //------------------------------ custom events ---------------------------------------------
    event _TokenListed(address token_address ,uint256 _tokenId, uint256 _amount);
    event _ListingUpdated(address token_address ,uint256 _tokenId, uint256 _newPrice);
    event _nftSold(address indexed _nftAddress,uint256 indexed _tokenId, uint256 indexed _amount);
    event MarketPlace_RevenueWithdrawn(address indexed _owner ,uint256 indexed _amount);
    event CancelledListing(address indexed _nftAddress,uint256 indexed _tokenId);


    //------------------------------ constructor ----------------------------------------------

     constructor(address _token){
        s_paymentToken = IERC20(_token);
     }

    //------------------------------ modifiers -------------------------------------------------
    modifier _isOwner(address _user,address _nftAddress, uint256 _tokenId){
        if(IERC721(_nftAddress).ownerOf(_tokenId) !=_user){
            revert MarketPlace_NotOwnerOfNFT();
        }
        _;
    }

    modifier _Listed(address _nftAddress, uint256 _tokenId) {
        Listing memory listing = s_nftListings[_nftAddress][_tokenId] ;
        if(listing._price > 0){
         revert MarketPlace_NFTNotListed(_nftAddress, _tokenId);
        }
        _;
    }

modifier _notListed(address _nftAddress, uint256 _tokenId) {
        Listing memory listing = s_nftListings[_nftAddress][_tokenId] ;
        if(listing._price >0){
         revert MarketPlace_NFTAlreadyListed(_nftAddress, _tokenId);
        }
        _;
    }

    //------------------------------- public functions------------------------------------------
    /**
     *@param _nftAddress: address of the nft collection
     *@param _tokenId: unique id of the token in nft collection
     *@param _price: price of nft in USDC
     *@notice conditions to list:
       - must be owner
       - token must not be already listed
       - non-reentrant
        */
    function listNft(address _nftAddress, uint256 _tokenId, uint256 _price) public 
    _isOwner(msg.sender,_nftAddress,_tokenId)
    _notListed(_nftAddress,_tokenId)
     nonReentrant {
        //price must be greater than 0
        if(_price <=0){
            revert MarketPlace_ListingPriceMustBeGreaterThanZero();
        }
        //set price && owner
       s_nftListings[_nftAddress][_tokenId]._price = _price;
       emit _TokenListed(_nftAddress,_tokenId,_price);
    }

    /**
     * 
     * @param _nftAddress : address of nft contract  
     * @param _tokenId  : token id of the selected nft
     */
    function cancelListing(address _nftAddress,uint256 _tokenId) 
    _isOwner(msg.sender,_nftAddress,_tokenId)
    _Listed(_nftAddress,_tokenId)
    public {
        //update listing 
        delete s_nftListings[_nftAddress][_tokenId];
        emit CancelledListing(_nftAddress,_tokenId);

    }

    /**
     *@param _nftAddress: address of the nft collection
     *@param _tokenId: unique id of the token in nft collection
     *@param _newAmount: price of nft in USDC
     *@notice conditions to update listing :
       - must be owner
       - non-reentrant
       - token must already be listed 
     */
     function updateListing(address _nftAddress,uint256 _tokenId, uint256 _newAmount) public 
    _isOwner(msg.sender,_nftAddress,_tokenId)
    _Listed(_nftAddress,_tokenId)
     nonReentrant {
       s_nftListings[_nftAddress][_tokenId]._price = _newAmount;
       emit _ListingUpdated(_nftAddress,_tokenId,_newAmount);
    }
    
    /**
     * @param _nftAddress: address of nft collectiont to buy from 
     * @param _tokenId : ID of the unique token to buy
     * @notice conditions to buy a listing :
       - must not be owner
       - non-reentrant
       - token must already be listed 
     */
    function buyNft(address _nftAddress, uint256 _tokenId) public 
    nonReentrant
    _Listed(_nftAddress,_tokenId)
     {
    Listing memory listedItem = s_nftListings[_nftAddress][_tokenId];
    //if buyer is owner revert
    if(listedItem._seller == msg.sender){
        revert MarketPlace_CannotBuyYourOwnNFT();
    }
    //delete listing mapping 
    uint256 price =listedItem._price;
    delete s_nftListings[_nftAddress][_tokenId];
    //transfer token amount to user 
    s_paymentToken.safeTransferFrom(msg.sender, address(this),price);
    // transfer nft to msg.sender 
    IERC721(_nftAddress).transferFrom(msg.sender,listedItem._seller, _tokenId);
    //update owner_revenue
    s_user_revenue[IERC721(_nftAddress).ownerOf(_tokenId)] += price;
    emit _nftSold(_nftAddress, _tokenId, price);
    }

    /**
     * 
     */
    function withDrawRevenue(uint256 _amount) public nonReentrant {
      // check if owner has some revenue:
      if(s_user_revenue[msg.sender] <=0 || s_user_revenue[msg.sender] < _amount){
        revert MarketPlace_NoTEnoughRevenue();
      }
      //update revenue
      delete s_user_revenue[msg.sender];
      //send revenue to user;
      IERC20(s_paymentToken).safeTransfer(msg.sender, _amount);
      emit MarketPlace_RevenueWithdrawn(msg.sender,_amount);
    }


    //------------------------------- view, pure functions -------------------------------------
    function getPaymentToken() public view returns(IERC20){
        return s_paymentToken;
    }

    function getListing(address _nftAddress, uint256 _tokenId) public view returns(Listing memory){
         return s_nftListings[_nftAddress][_tokenId];
    }

    function getUserRevenue(address _user )public view returns (uint256){
         return s_user_revenue[_user];
    }
    




}





//sloth
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "smart-contract/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from  "smart-contract/lib/openzeppelin-contracts/contracts/access/Ownable.sol";

error ERC721Metadata__URI_QueryFor_NonExistentToken();

contract SlothNFT is ERC721, Ownable {
    uint256 private s_tokenCounter;
    string s_collection_ifsURI;

    // Mapping from tokenId => IPFS URI
    mapping(uint256 => string) private s_tokenIdToIPFS;

    event SlothMinted(uint256 indexed tokenId, address indexed owner, string ipfsURI);

    constructor(string memory _collectionIPFS_URI) ERC721("Sloth NFT", "SLOTH") Ownable(msg.sender) {
        //initialise collection images uri
        s_collection_ifsURI = _collectionIPFS_URI;
    }

    /**
     * @notice Mint a new Sloth NFT with an off-chain IPFS URI
     * @param ipfsURI The IPFS link to the generated Sloth SVG/PNG
     */
    function mintSloth(string memory ipfsURI) external returns (uint256){
        uint256 tokenId = s_tokenCounter;
        s_tokenIdToIPFS[tokenId] = ipfsURI;

        _safeMint(msg.sender, tokenId);
        s_tokenCounter++;

        emit SlothMinted(tokenId, msg.sender, ipfsURI);
        return tokenId;
    }

    /**
     * @notice Returns the token URI pointing to the off-chain IPFS metadata
     * @dev Metadata should include name, description, image, and attributes
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (keccak256(abi.encodePacked(s_tokenIdToIPFS[tokenId])) == keccak256(abi.encodePacked(""))) revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        return s_tokenIdToIPFS[tokenId];
    }

    /**
     * @notice Returns the total number of minted Sloths
     */
    function totalMinted() external view returns (uint256) {
        return s_tokenCounter;
    }

    /**
     * @notice Admin function to update a token's IPFS URI if needed
     */
    function updateTokenURI(uint256 tokenId, string memory ipfsURI) external onlyOwner {
        if (keccak256(abi.encodePacked(s_tokenIdToIPFS[tokenId])) == keccak256(abi.encodePacked(""))) revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        s_tokenIdToIPFS[tokenId] = ipfsURI;
    }

    /**
     * @notice : get collection assets uri
     */
    function getCollection_ifpsURI() public view returns(string memory){
        return s_collection_ifsURI;
    }
}




//TEST for collections
//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import {DeployCollectionAndCollectionFactory} from "../script/DeployCollectionAndCollectionFactory.s..sol";
import {Test} from '../lib/forge-std/scripts/Test/';
import {CollectionFactory} from "../src/CollectionFactory.sol";
import {Collection} from "../src/Collection.sol";

contract TestDeployment is Test {
    //error
    error OwnableUnauthorizedAccount(address account);
    error Col_NotEnoughAmountToGetNFT();
    error Collection_NotListedForSale();

    CollectionFactory colFacory;
    DeployCollectionAndCollectionFactory deployScript;
    Collection collection;

    address OWNER = makeAddr("owner");
    address USER1 = makeAddr("user1");
    address USER2 = makeAddr("user2");
    uint256 constant MAX_NFT_LIMIT = 100;
    string constant NAME = "DANO_SOUR";
    string constant SYMBOL = "DASR";
    string constant TOKEN_URI = "ipfs://Qm.../metadata/1.json";
    string constant CONTRACT_URI = "ipfs://Contract./metadata/1.json";

    function setUp() public {
        // deal users
        vm.deal(USER1, 0.1 ether);
        vm.deal(USER2, 20 ether);
        vm.deal(OWNER, 10 ether);
        deployScript = new DeployCollectionAndCollectionFactory();
        colFacory = deployScript.run();
        vm.prank(OWNER); // owner should be the one who created the contract
        collection = Collection(colFacory.createCollection(NAME, SYMBOL, MAX_NFT_LIMIT, CONTRACT_URI));
    }

    // test nft name when created
    function testNFTNameIsCorrect() public {
        string memory name = "DANO_SOUR";
        assertEq(keccak256(bytes(abi.encodePacked(name))), keccak256(bytes(abi.encodePacked(collection.name()))));
    }

    // test minting
    function testMintGivesCorrectTokenURI() public {
        string memory expectedTokenURI = "ipfs://Qm.../metadata/1.json";
        // Now mint with the owner
        vm.prank(OWNER);
        collection.mint(expectedTokenURI);
        // get tokenURI at 0 index
        string memory returnedTokenURI = collection.tokenURI(0);
        // compare returned token uri to expected
        assertEq(keccak256(bytes(expectedTokenURI)), keccak256(bytes(returnedTokenURI)));
    }

    // test owner of a collection nft
    function testOwnerIsCorrect() public {
        string memory expectedTokenURI = "ipfs://Qm.../metadata/1.json";
        // Now mint with the owner
        vm.prank(OWNER);
        collection.mint(expectedTokenURI);
        // compare returned token uri to expected
        assertEq(collection.ownerOf(0), OWNER);
    }

    //test only Owner can mint nft
    function testMintRevertIfCallerIsNotOwner() public {
        string memory expectedTokenURI = "ipfs://Qm.../metadata/1.json";
        // Now mint with the owner
        vm.prank(USER1);
        // Expect revert with correct custom error
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, USER1));
        collection.mint(expectedTokenURI);
    }

    // test nft transfer
    function testTokenTransferSucess() public {
        vm.prank(OWNER);
        collection.mint(TOKEN_URI);
        vm.prank(OWNER);
        // approve spender
        collection.approve(USER1, 0);
        vm.prank(USER1);
        collection.transferFrom(OWNER, USER2, 0);
        //CHECK THAT USER1 NOW HAVE TOKEN IN THEIR WALLET
        address actualOwner = collection.ownerOf(0);
        assertEq(actualOwner, USER2);
    }

    // function test buy
    function testBuyReverIfNotEnoughAmountProvided() public {
        vm.prank(USER1);
        vm.expectRevert();
        collection.buy(0);
    }

    // ensure nft do not sell after unlisting
    function testCancelListing() public {
        vm.prank(OWNER);
        collection.mint("ipfs://metadata/1.json");

        uint256 price = 1 ether;
        vm.prank(OWNER);
        collection.listForSale(0, 0.12 ether);

        vm.prank(OWNER);
        collection.cancelListing(0);

        // Try to buy after canceling should fail
        vm.deal(USER1, 2 ether);
        vm.prank(USER1);
        vm.expectRevert(abi.encodeWithSelector(Collection.Collection_NotListedForSale.selector));
        collection.buy{value: price}(0);
    }
}


//collections
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions
//Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/*
 * @title Colletion
 * @author Daniel Kpatamia
 *
 * Collection is designed to be as minimal as possible, and have the logics needed for:
 *  1. minting NFT
 *  2. Buying/Selling NFT
 *  3. Ownership transfer of NTF.
 * 
 * It's identical to any general purpose NFT found expecially for art pieces like NPG,JPEG,JEG etc 
 * The NFTs are designed such that only owner can sell, mint NFTs at anytime
 *
 * @notice This contract is the core of the Collection Factory that deploys clones. It handles all the logic
 * for minting and redeeming NFT, as well as payment for buying and all transactions involved with the NFT tokens minted .
 * @notice This contract is based on the OpenSea NFT system
 */

contract Collection is Initializable, ERC721Upgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    //error
    error Col_NotEnoughAmountToGetNFT();
    error Collection_NotOwner(address, address);
    error Collection_NotListedForSale();
    error Collection_CannotBuyYourOwnNFT();
    error Collection_NFTNotForSaleOrNotEnoughFunds();
    error Collection_PaymentFailed(address seller, address buyer, uint256 price);
    error Collection_TransferFailed();
    error Collection_MintLimitExceeded(uint256 maxAmount, uint256 totalMinted);

    //state variables
    uint256 private s_tokenCounter;
    mapping(uint256 tokenId => string tokenURI) s_tokenIdToTokenURI;
    mapping(uint256 tokenId => uint128 ethPrice) s_tokenIdToPriceInEth; // listed tokens
    mapping(string token_uri => uint256 tokenId) s_tokenURIToId;
    uint256 private i_maxTokens;
    address private s_owner;
    // contract uri for the contract level metadata
    string private i_contract_uri;

    //events
    event Collection_NFTMintedSuccess(address _to, address _from, uint256 _tokenId);
    event Collection_NFTBought(address _from, address _to, uint256 price);
    event Collection_NFTListedForSale(string token_uri, uint256 price);
    event Collection_Received(address _from, uint256 _amount, string note);

    //------------- modifiers --------------------------------------------------------------------
    modifier PayBalanceIfThereIs(uint256 token_id) {
        uint256 price = s_tokenIdToPriceInEth[token_id];
        if (msg.value > price) {
            (bool paidBackBallance,) = payable(msg.sender).call{value: msg.value - price}("");
            if (!paidBackBallance) {
                revert Collection_TransferFailed();
            }
        }
        _;
    }

    modifier NotExceedTotalSupply(uint256 maxAmount, uint256 totalMintedAlready) {
        if (totalMintedAlready > maxAmount) {
            revert Collection_MintLimitExceeded(maxAmount, totalMintedAlready);
        }
        _;
    }
    //------------- intialiser (for construcotor like role) --------------------------------------

    /*
    * @param _owner: adddress of collection owner - whoever deploys a clone throught the Collection Factory owns that clone
    * @param name: The unique name of NFT minted 
    * @param symbol: symbol  of NFT minted
    * @notice: This function will be used in the collection factory to deploy a unique clone of an NFT 
    */
    function initialize(
        address _owner,
        string memory name,
        string memory symbol,
        uint256 _total_supply,
        string memory _contract_uri
    ) public initializer {
        //set contract level uri
        i_contract_uri = _contract_uri;
        i_maxTokens = _total_supply; // maximum amount of the collection that can be minted
        s_owner = _owner;
        s_tokenCounter = 0; // intial minted tokens
        __ERC721_init(name, symbol); // intialises an nft with name and symbol
        __Ownable_init(_owner);
    }

    //------------- receive ----------------------------------------------------------------------
    /*
    @notice: It's possible for a transaction without msg.data to hit the contract with Eth transfer: 
    *- In this way we want to leverage and autoPurchase token with funds sent so user does not loss Eth
    */
    // receive() external payable {
    //     _autoPurchaseNFT(msg.sender, msg.value, "");
    //     emit Collection_Received(msg.sender, msg.value, "Call with no data");
    // }

    //------------- public  fuunction ------------------------------------------------------------
    /*
    *@param _tokenURI: the URI from ipfs after uploading file to be minted
    *@notice : This function takes a file URI and mints a unique NFT  for owner: but it first check to see if minted max-cap is exceeded
    */
    function mint(string memory _tokenURI)
        public
        onlyOwner
        nonReentrant
        NotExceedTotalSupply(i_maxTokens, s_tokenCounter)
    {
        // token URI is a combination image uri and metadata
        s_tokenCounter += 1;
        s_tokenIdToTokenURI[s_tokenCounter] = _tokenURI; // create new token
        //store the reverse mapping : uri => id
        s_tokenURIToId[_tokenURI] = s_tokenCounter;
        _safeMint(msg.sender, s_tokenCounter); // mint token id to minter
        emit Collection_NFTMintedSuccess(msg.sender, s_owner, s_tokenCounter);
    }

    // token uri
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToTokenURI[tokenId]; // return the stores uri
    }

    /**
     *
     * @notice: Contract level uri points to a contracts metadata on ipfs
     */
    function contractURI() public view returns (string memory) {
        return i_contract_uri;
    }

    //base uri
    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }
    // expose total minted tokens in this collection

    function getTotalMintedTokens() public view returns (uint256) {
        return s_tokenCounter;
    }

    //---------------- fallback --------------------------------------------------------------
    /*
    *@notice: Theres is possibility that user may send Eth with data but no actual function calls that match: 
    *- In this way we want to try auto purchase of nft to prevent loss of funds on the part of the user 
    */
    // fallback() external payable {
    //     _autoPurchaseNFT(msg.sender, msg.value, msg.data);
    //     emit Collection_Received(msg.sender, msg.value, "Unexpected call");
    // }
    //------------------ internal functions --------------------------------------------------

    function _autoPurchaseNFT(address buyer, uint256 amount, bytes memory data) internal {
        // check the entire token mappings sell on first price match
        for (uint256 token_id = 0; token_id < s_tokenCounter; token_id++) {
            if (s_tokenIdToPriceInEth[token_id] == amount) {
                _executePurchase(buyer, token_id, amount);
            }
        }
    }


    //-------------- views & pure functions --------------------------------------------------
    function getLatestId() public view returns (uint256) {
        return s_tokenCounter;
    }
}



//Deployscript for collections:
//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {CollectionFactory} from "../src/CollectionFactory.sol";
import {Collection} from "../src/Collection.sol";

contract DeployCollectionAndCollectionFactory is Script {
    Collection col;
    CollectionFactory colFactory;
    address col_address;

    function run() public returns (CollectionFactory) {
        vm.startBroadcast();
        // deploy collection contract
        col = new Collection();
        col_address = address(col);
        colFactory = new CollectionFactory(col_address);
        vm.stopBroadcast();
        return colFactory;
    }
    /*script in a makefile to deploy this contract :
    - first to anvil 
    - second to sepolia 
    */
}


//collection factory
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/* 
 Deployment Order
 1. Deploy Collection contract as logic
 2. Deploy CollectionFactory with the logic address as constructor arg
 3. Call createCollection(name, symbol) to deploy clones
*/

// This is considered an Exogenous, Decentralized, Anchored (pegged), Crypto Collateralized low volatility coin
// Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions
// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Collection} from "./Collection.sol";

/*
 * @title DSCEngine
 * @author Daniel Kpatamia
 *
 * The system is designed to be as minimal as possible, and have the tokens maintain a 1 token == $1 peg at all times.
 * This is a stablecoin with the properties:
 * - Exogenously Collateralized
 * - Dollar Pegged
 * - Algorithmically Stable
 *
 * It is similar to DAI if DAI had no governance, no fees, and was backed by only WETH and WBTC.
 *
 * Our DSC system should always be "overcollateralized". At no point, should the value of
 * all collateral < the $ backed value of all the DSC.
 *
 * @notice This contract is the core of the Decentralized Stablecoin system. It handles all the logic
 * for minting and redeeming DSC, as well as depositing and withdrawing collateral.
 * @notice This contract is based on the MakerDAO DSS system
 */

contract CollectionFactory {
    address public implementation;
    mapping(address user => address[] collections) public user_collections;

    event CollectionCreated(address indexed creator, address indexed collection);

    constructor(address _implementation) {
        implementation = _implementation; // address of the deploy collection contract
    }

    /*
    * @param tokenCollateralAddress: the address of the token to deposit as collateral
    * @param amountCollateral: The amount of collateral to deposit
    * @param amountDscToMint: The amount of DecentralizedStableCoin to mint
    * @notice: This function will deposit your collateral and mint DSC in one transaction
    */
    function createCollection(
        string memory name,
        string memory symbol,
        uint256 total_supply,
        string memory contract_uri
    ) external returns (address) {
        address clone = Clones.clone(implementation);
        Collection(clone).initialize(msg.sender, name, symbol, total_supply, contract_uri);
        user_collections[msg.sender].push(clone);
        emit CollectionCreated(msg.sender, clone);
        return clone;
    }

    function getCollections() external view returns (address[] memory) {
        return user_collections[msg.sender];
    }
}


//MAKE file
# Load environment variables
-include .env

# Default values
DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# PHONY targets
.PHONY: all test clean deploy fund help install snapshot format anvil \
        mint deployMood mintMoodNft flipMoodNft deploy_sepolia deploy_anvil

# Help message
help:
	@echo "Usage:"
	@echo "  make deploy ARGS=\"--network sepolia\""
	@echo "  make mint ARGS=\"--network sepolia\""
	@echo "  make deployMood ARGS=\"--network sepolia\""
	@echo "  make flipMoodNft ARGS=\"--network sepolia\""
	@echo "  make test | clean | build | install | snapshot | format"

# Full clean and rebuild
all: clean remove install update build

# Basic commands
clean: ; forge clean
remove: ; rm -rf .gitmodules lib .git/modules/* && touch .gitmodules && git add . && git commit -m "modules reset"
install: ; forge install Cyfrin/foundry-devops@0.0.11 --no-commit && \
           forge install foundry-rs/forge-std@v1.5.3 --no-commit && \
           forge install openzeppelin/openzeppelin-contracts@v4.8.3 --no-commit
update: ; forge update
build: ; forge build
test: ; forge test
snapshot: ; forge snapshot
format: ; forge fmt

# Run local anvil node
anvil:
	anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

# Set default network args to anvil
NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

# Override if deploying to Sepolia
ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) \
                    --private-key $(PRIVATE_KEY) \
                    --broadcast \
                    --verify \
                    --etherscan-api-key $(ETHERSCAN_API_KEY) \
                    -vvvv
endif

# Deployment scripts
deploy:
	@forge script script/DeployBasicNFT.s.sol:DeployBasicNFT $(NETWORK_ARGS) $(ARGS)

deploy_sepolia:
	@forge script script/DeployCollectionAndCollectionFactory.s..sol:DeployCollectionAndCollectionFactory \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--chain-id 11155111 \
		--verify \
		--etherscan-api-key $(ETHERSCAN_API_KEY)

deploy_anvil:
	@forge script script/DeployCollectionAndCollectionFactory.s..sol:DeployCollectionAndCollectionFactory \
		--rpc-url $(ANVIL_RPC_URL) \
		--private-key $(ANVIL_PRIVATE_KEY) \
		--broadcast

# NFT actions
mint:
	@forge script script/Interactions.s.sol:MintNFT $(NETWORK_ARGS) $(ARGS)

deployMood:
	@forge script script/DeployMoodNft.s.sol:DeployMoodNft $(NETWORK_ARGS) $(ARGS)

mintMoodNft:
	@forge script script/Interactions.s.sol:MintMoodNft $(NETWORK_ARGS) $(ARGS)

flipMoodNft:
	@forge script script/Interactions.s.sol:FlipMoodNft $(NETWORK_ARGS) $(ARGS)

# Show help by default
.DEFAULT_GOAL := help


//ENV
PRIVATE_KEY=63ed5d469df851662b34e8ade920556cbaf217c1147f6da1d42016f419e41f89
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YWhiM3CrIJD8xuHH2b75T
ANVIL_RPC_URL=http://localhost:8545 
ANVIL_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
ANVIL_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
ETHERSCAN_API_KEY=PDDGBG42VKF97I6WNXUPPFE2SG7RM2FNDZ

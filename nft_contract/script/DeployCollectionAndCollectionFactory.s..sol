/* 
✅ Deployment Order
Deploy Collection contract as logic

Deploy CollectionFactory with the logic address as constructor arg

Call createCollection(name, symbol) to deploy clones
*/

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

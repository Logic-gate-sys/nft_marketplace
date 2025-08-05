    //SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Collection} from "./Collection.sol";

contract CollectionFactory {
    address public implementation;
    address[] public allCollections;

    event CollectionCreated(address indexed creator, address collection);

    constructor(address _implementation) {
        implementation = _implementation; // address of the deploy collection contract
    }

    function createCollection(string memory name, string memory symbol) external returns (address) {
        address clone = Clones.clone(implementation);
        Collection(clone).initialize(msg.sender, name, symbol);
        allCollections.push(clone); // store all collection created in array
        emit CollectionCreated(msg.sender, clone);
        return clone;
    }

    function getCollections() external view returns (address[] memory) {
        return allCollections;
    }
}

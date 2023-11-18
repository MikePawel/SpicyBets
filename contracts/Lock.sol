// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TreePlantingTracker {
    // Mapping from an address to the number of trees planted
    mapping(address => uint256) public treesPlanted;
    uint256 public totalTrees;

    address public owner;

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Function to plant a tree
   function plantTree() public payable {
    uint256 numberOfTrees = msg.value / 1e18; // treeCost would be defined elsewhere in the contract
    require(numberOfTrees > 0, "You must send enough ETH to plant at least one tree");
    treesPlanted[msg.sender] += numberOfTrees;
    totalTrees += numberOfTrees;
}

    // Function to get the number of trees planted by an address
    function getTreesPlanted(address user) public view returns (uint256) {
        return treesPlanted[user];
    }

     function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

      function withdraw(address payable recipient) public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");
        recipient.transfer(balance);
    }

}

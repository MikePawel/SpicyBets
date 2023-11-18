// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ERC20DepositAndSend {
    address public owner;
    IERC20 public token;

    event Deposited(address indexed sender, uint256 amount);
    event Sent(address indexed beneficiary, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
    }

    // Deposit ERC20 tokens into the contract
    function deposit(uint256 amount) external {
        require(amount > 0, "Deposit amount must be greater than 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Deposited(msg.sender, amount);
    }

    // Owner can send ERC20 tokens to a specific address
    function sendToAddress(address beneficiary, uint256 amount) external onlyOwner {
        require(beneficiary != address(0), "Cannot send to zero address");
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance in contract");
        require(token.transfer(beneficiary, amount), "Transfer failed");
        emit Sent(beneficiary, amount);
    }

    // Check the contract's balance of the ERC20 token
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}

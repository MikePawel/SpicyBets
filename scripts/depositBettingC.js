// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`.
// If you do that, Hardhat will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import hre from "hardhat";

async function main() {
    // We get the contract to deploy
    const ERC20DepositAndSend = await hre.ethers.getContractFactory("ERC20DepositAndSend");

    // Replace 'YOUR_ERC20_TOKEN_ADDRESS' with the actual token contract address
    const erc20TokenAddress = "0x63667746A7A005E45B1fffb13a78d0331065Ff7f";

    // Deploy the contract with the ERC20 token address as a constructor argument
    const erc20DepositAndSend = await ERC20DepositAndSend.deploy(erc20TokenAddress);

    // Wait for the deployment to be mined
    await erc20DepositAndSend.deployed();

    console.log("ERC20DepositAndSend deployed to:", erc20DepositAndSend.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

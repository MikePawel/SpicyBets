import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Meme = await hre.ethers.getContractFactory("Meme");
  const meme = await Meme.deploy(deployer.address);

  await meme.deployed();

  console.log("Meme deployed to:", meme.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

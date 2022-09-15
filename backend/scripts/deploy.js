const hre = require("hardhat");

async function main() {
    // Get the contract to deploy
    const BuyMeACoffeeFactory = await hre.ethers.getContractFactory("BuyMeACoffee");
    // Deploy contract
    const buyMeACoffee = await BuyMeACoffeeFactory.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to", buyMeACoffee.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
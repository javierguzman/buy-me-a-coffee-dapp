// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function printBalances(addresses) {
  let index = 0;
  for (const address of addresses) {
    const accountBalance = await getBalance(address);
    console.log(`Address ${index} balance: `, accountBalance);
    index++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const { timestamp, name, from , message } = memo;
    console.log(`At ${timestamp}, ${name} (${from}) said: "${message}"`);
  }
}

async function main() {
  // Get example accounts
  const [owner, tipper1, tipper2, tipper3]  = await hre.ethers.getSigners();

  // Get the contract to deploy
  const BuyMeACoffeeFactory = await hre.ethers.getContractFactory("BuyMeACoffee");
  // Deploy contract
  const buyMeACoffee = await BuyMeACoffeeFactory.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to", buyMeACoffee.address);

  // check balances before the coffee purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log("== start ==")  ;
  await printBalances(addresses);
  // buy the owner a few coffees
  const tip = { value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper1).buyCoffee("Valentina", "I love you", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Andres", "You are doing great", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Stefano", "Happy to see everything good", tip);
  // check balances after coffee purchase
  console.log("== start ==")  ;
  await printBalances(addresses);
  // withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();
  // check balance after withdraw
  console.log("== withdrawTips ==")  ;
  await printBalances(addresses);
  // read all the memos
  console.log("== memos ==")  ;
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

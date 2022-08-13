const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress = "0x2df69d44FD420Af3Aa60Be5F152aA8B3E42cF7c1";
  const contractABI = abi.abi;

  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API_KEY
  );

  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log(
    "current balance of contract: ",
    await getBalance(provider, buyMeACoffee.address),
    "ETH"
  );
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..");
    const withdrawTxn = await buyMeACoffee.withdrawCoffeeTo(
      "0x4613452431311Aee9C669E500AF3Ebb0B18B7182"
    );
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

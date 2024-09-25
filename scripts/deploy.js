const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  [deployer] = await ethers.getSigners()
  const NAME = "Echo"
  const SYMBOL = "ECHO"

  const Echo = await ethers.getContractFactory(NAME)
  const echo = await Echo.deploy(NAME, SYMBOL)
  await echo.deployed()

  console.log("Echo deployed to:", echo.address)

  const CHANNEL_NAMES = ["general", "intro", "jobs"]
  const COSTS = [tokens(1), tokens(0), tokens(0.25)]
  for (let i = 0; i < 3; i++) {
    const transaction = await echo.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
    await transaction.wait()
    console.log(`Created channel ${CHANNEL_NAMES[i]} with cost ${COSTS[i]}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
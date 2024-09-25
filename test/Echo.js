const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Echo", function () {

  const NAME = "Echo"
  const SYMBOL = "ECHO"

  let echo

  beforeEach(async function () {
    [deployer,user] = await ethers.getSigners()

    const Echo = await ethers.getContractFactory("Echo")
    echo = await Echo.deploy(NAME, SYMBOL)
    const transaction = await echo.connect(deployer).createChannel("general",tokens(1))
    await transaction.wait()
  })

  describe("Deployment", function () {
    it("Sets the name", async () => {
      let result = await echo.name()
      expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      let result = await echo.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      let result = await echo.owner()
      expect(result).to.equal(deployer.address)
    })

  })


  describe("Creating Channels", function () {
    it("Returns Total Channels", async () => {
      const channel = await echo.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal("general")
      expect(channel.cost).to.be.equal(tokens(1))
    })
  })

  describe("Joining Channels", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("1",'ether')

    beforeEach(async () => {
      const transaction = await echo.connect(user).mint(ID,{value:AMOUNT})
      await transaction.wait()
    })

    it("Joins the user", async () => {
      const result = await echo.hasJoined(ID, user.address)
      expect(result).to.be.equal(true)
    })

    it("Increases total supply", async () => {
      const result = await echo.totalSupply()
      expect(result).to.be.equal(ID)
    })

    it("Uploads the contract balance", async () => {
      const result = await ethers.provider.getBalance(echo.address)
      expect(result).to.be.equal(AMOUNT)
    })

  })

  describe("Withdrawing",() => {
    const ID = 1
    const AMOUNT  = ethers.utils.parseUnits("10",'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)
      let transaction = await echo.connect(user).mint(ID,{value:AMOUNT})
      await transaction.wait()
      transaction = await echo.connect(deployer).withdraw();
      await transaction.wait();
    })

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.above(balanceBefore)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(echo.address)
      expect(result).to.be.equal(0)
    })
  })

})

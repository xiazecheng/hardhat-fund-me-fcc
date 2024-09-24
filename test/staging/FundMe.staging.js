const { assert } = require("chai")
const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const { devlopmentChains } = require("../../helper-hardhat-config")

const sendValue = ethers.parseEther("0.03")

devlopmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let deployer, fundMe, accounts
          beforeEach(async () => {
              // 部署fundMe合约
              accounts = await ethers.getSigners()
              const accountZero = accounts[0]
              deployer = accountZero
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  (await deployments.get("FundMe")).address,
                  deployer,
              )
          })
          it("allows people to fund and withdraw", async () => {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target,
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })

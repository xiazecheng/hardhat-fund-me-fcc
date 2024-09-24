const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, deployments } = require("hardhat")
const { devlopmentChains } = require("../../helper-hardhat-config")

const sendValue = ethers.parseEther("1")
!devlopmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let deployer, fundMe, mockV3Aggregator, accounts

          beforeEach(async () => {
              // 部署fundMe合约
              accounts = await ethers.getSigners()
              const accountZero = accounts[0]
              deployer = accountZero
              // not work
              // deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              // deploy with tags
              // not works
              // fundMe = await ethers.getContract("FundMe", deployer)
              // mockV3Aggregator = await ethers.getContract(
              //     "MockV3Aggregator",
              //     deployer,
              // )
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  (await deployments.get("FundMe")).address,
                  deployer,
              ) // most recently deployed fundme contract
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  (await deployments.get("MockV3Aggregator")).address,
                  deployer,
              )
          })

          describe("constructor", async () => {
              it("sets the aggregator address correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  // console.log(response)
                  assert.equal(response, await mockV3Aggregator.getAddress())
              })
          })

          describe("fund", async () => {
              it("Fail if you don't send enough ETH", async () => {
                  // expect => waffle
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to send more ETH!",
                  )
              })
              it("updated the amount founded structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer.address,
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer.address)
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraws ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipe = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipe
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  )
              })

              it("is allows us to withdraw with multiple funders", async () => {
                  // Arrange
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipe = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipe
                  const gasCost = gasUsed * gasPrice
                  // Assert
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
              it("only allows the owner to withdraw", async () => {
                  const attracker = accounts[1]
                  const attrackerConnectedContract =
                      await fundMe.connect(attracker)
                  await expect(
                      attrackerConnectedContract.withdraw(),
                  ).to.be.revertedWithCustomError(
                      attrackerConnectedContract,
                      "FundMe_NotOwner",
                  )
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraws ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipe = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipe
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target,
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + startingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString(),
                  )
              })

              it("is allows us to withdraw with multiple funders", async () => {
                  // Arrange
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipe = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionReceipe
                  const gasCost = gasUsed * gasPrice
                  // Assert
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
              it("only allows the owner to withdraw", async () => {
                  const attracker = accounts[1]
                  const attrackerConnectedContract =
                      await fundMe.connect(attracker)
                  await expect(
                      attrackerConnectedContract.cheaperWithdraw(),
                  ).to.be.revertedWithCustomError(
                      attrackerConnectedContract,
                      "FundMe_NotOwner",
                  )
              })
          })
      })

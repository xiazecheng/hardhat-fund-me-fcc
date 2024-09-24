const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContractAt("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundMe.address}`)
    console.log("Funding contract...")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.1"),
    })
    await transactionResponse.wait()
    console.log("Funded!")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

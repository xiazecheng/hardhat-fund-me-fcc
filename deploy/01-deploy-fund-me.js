const { network } = require("hardhat")
const { networkConfig, devlopmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify.js")

// 1
// function deployFunc(hre) {
//     console.log("deployFunc")
// }
// module.exports.default = deployFunc

// 2
// module.exports.default = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//     // means
//     // getNamedAccounts = hre.getNamedAccounts
//     // deployments = hre.deployments
// }
// 3 (1=2=3)
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    if (devlopmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        // 通过不同的chainId获取到不同的priceFeed合约地址
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blcokConfirmations || 1,
    })
    log("-----------------------------------------------")
    if (!devlopmentChains.includes(network.name)) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]

const { network } = require("hardhat")
const {
    networkConfig,
    DECIMALS,
    INITIAL_ANSWER,
    devlopmentChains,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log, deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (devlopmentChains.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            // contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed")
        log("-----------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]

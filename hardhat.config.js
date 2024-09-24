require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify")
// require("./task/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const { version } = require("chai")
const { ProxyAgent, setGlobalDispatcher } = require("undici")
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890")
setGlobalDispatcher(proxyAgent)

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
module.exports = {
    // solidity: "0.8.27",
    solidity: {
        compilers: [{ version: "0.8.27" }, { version: "0.6.27" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blcokConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY,
    },
    sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: false,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gasReport.txt",
        noColor: true,
        currency: "USD",
        // token: "matic",
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            11155111: 0,
        },
    },
}

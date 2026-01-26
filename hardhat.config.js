require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

  const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  const providerUrl = process.env.REACT_APP_PROVIDER_URL;
  const polygon_api_key = process.env.REACT_APP_POLYGONSCAN_API_KEY;

  const PUBLIC_KEY = "0xD7E3fa332A5C590EF889c51Fcf48b31b5d408937";


module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "polygon_amoy",
  networks: {
    hardhat: {
    },
    polygon_amoy: {
      url: providerUrl,
      accounts: [`0x${privateKey}`]
    }
  },

  etherscan: {
    apiKey: polygon_api_key,
},
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
}

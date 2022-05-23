// @ts-nocheck

require('dotenv').config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
require('@nomiclabs/hardhat-ethers');


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      timeout: 2000000,
      chainId: 31337,
    },

    //mainnet config
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_MAINNET_API_KEY}`,
        blockNumber: 14830483,
        chainId: 31338
      },
      timeout: 2000000
    }
  },
  
};
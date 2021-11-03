/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');

const { ALCHEMY_API_URL, METAMASK_PRIVATE_KEY, ETHERSCAN_KEY } = process.env;

module.exports = {
    solidity: '0.8.9',
    defaultNetwork: 'ropsten',
    networks: {
        hardhat: {},
        ropsten: {
            url: ALCHEMY_API_URL,
            accounts: [`0x${METAMASK_PRIVATE_KEY}`],
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_KEY,
    },
};

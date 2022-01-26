const hre = require('hardhat');
const { ethers } = hre;

// const keyPairs = require('../cypress/support/constants/keypairs.json');
const ERC20_ABI = require('../tests/fixtures/erc20_abi.json');

async function main() {
  const testAccount = '0x8028Ef7ADA45AA7fa31EdaE7d6C30BfA5fb3cf0B';
  const mkrAddress = '0xc5E4eaB513A7CD12b2335e8a0D57273e13D499f7';

  // This is the test account used on the tests
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [testAccount]
  });

  const signer = await ethers.getSigner(testAccount);

  const mkrToken = new ethers.Contract(mkrAddress, ERC20_ABI, signer);

  //manipulate mkr contract, give test address 250K MKR
  //https://kndrck.co/posts/local_erc20_bal_mani_w_hh/

  const toBytes32 = (bn) => {
    return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
  };

  const setStorageAt = async (address, index, value) => {
    await ethers.provider.send('hardhat_setStorageAt', [address, index, value]);
    await ethers.provider.send('evm_mine', []);
  };

  const MKR_SLOT = 3;
  const index = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [testAccount, MKR_SLOT]
  );

  await setStorageAt(
    mkrAddress,
    index.toString(),
    toBytes32(ethers.utils.parseUnits('250000')).toString()
  );

  const mkrBalance = await mkrToken.balanceOf(testAccount);
  console.log(`test account now has ${ethers.utils.formatUnits(mkrBalance)} MKR`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
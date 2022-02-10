const hre = require('hardhat');
const { ethers } = hre;

// const keyPairs = require('../cypress/support/constants/keypairs.json');
const ERC20_ABI = require('../cypress/fixtures/erc20_abi.json');
const END_ABI = require('../cypress/fixtures/end_abi.json');

async function main() {
  const testAccount = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const mkrAddress = '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2';
  const endAddress = '0xBB856d1742fD182a90239D7AE85706C2FE4e5922';

  // This is the test account used on the tests
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [testAccount]
  });

  const signer = await ethers.getSigner(testAccount);

  const mkrToken = new ethers.Contract(mkrAddress, ERC20_ABI, signer);
  const end = new ethers.Contract(endAddress, END_ABI, signer);

  //manipulate mkr contract, give test address 250K MKR
  //https://kndrck.co/posts/local_erc20_bal_mani_w_hh/

  const toBytes32 = (bn) => {
    return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
  };

  const setStorageAt = async (address, index, value) => {
    await ethers.provider.send('hardhat_setStorageAt', [address, index, value]);
    await ethers.provider.send('evm_mine', []);
  };

  //const MKR_SLOT = 3; //GOERLI
  const MKR_SLOT = 1; //MAINNET

  const indexMkr = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [testAccount, MKR_SLOT]
  );
  
  //set MKR balance to 250K
  await setStorageAt(
    mkrAddress,
    indexMkr.toString(),
    toBytes32(ethers.utils.parseUnits('250000')).toString()
  );

  await setStorageAt(
    endAddress,
    '0x9',
    toBytes32(ethers.BigNumber.from('0')).toString()
  );

  const mkrBalance = await mkrToken.balanceOf(testAccount);
  console.log(`test account now has ${ethers.utils.formatUnits(mkrBalance)} MKR`);
  //const wait = await end.wait();
  //console.log(`end wait is: ${wait.toString()}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
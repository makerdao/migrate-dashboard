const hre = require('hardhat');
const { ethers } = hre;

const ERC20_ABI = require('./erc20_abi.json');

async function main() {
  const testAccount = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const mkrAddress = '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2';
  const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const endAddress = '0x0e2e8F1D1326A4B9633D96222Ce399c708B19c28';

  // This is the test account used on the tests
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [testAccount]
  });

  const signer = await ethers.getSigner(testAccount);

  const mkrToken = new ethers.Contract(mkrAddress, ERC20_ABI, signer);
  const daiToken = new ethers.Contract(daiAddress, ERC20_ABI, signer);

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

  const DAI_SLOT = 2;

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

  const indexDai = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256'],
    [testAccount, DAI_SLOT]
  );
  
  //set DAI balance to 1000
  await setStorageAt(
    daiAddress,
    indexDai.toString(),
    toBytes32(ethers.utils.parseUnits('1000')).toString()
  );
  
  //set end.wait to 0
  await setStorageAt(
    endAddress,
    '0x9',
    toBytes32(ethers.BigNumber.from('0')).toString()
  );

  const mkrBalance = await mkrToken.balanceOf(testAccount);
  console.log(`test account now has ${ethers.utils.formatUnits(mkrBalance)} MKR`);
  const daiBalance = await daiToken.balanceOf(testAccount);
  console.log(`test account now has ${ethers.utils.formatUnits(daiBalance)} DAI`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
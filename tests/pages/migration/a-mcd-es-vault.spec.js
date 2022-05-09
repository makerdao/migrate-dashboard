import RedeemVaults from '../../../pages/migration/vaults';
// import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent } from '@testing-library/react';
import { instantiateMaker } from '../../../maker';
import { WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import ilkList from '../../../references/ilkList';

const { click } = fireEvent;

let maker;

//for now only test out ETH Vaults
//TODO: add more collateral types to the hardhat testchain
const ilks = ilkList.map(i => [i.symbol, i.currency, i.gem]);
const filteredIlks = ilks.filter(i => i[0] == 'ETH-A' || 
  i[0] == 'ETH-B' || i[0] == 'ETH-C');

//dust limit of ETH-B on mainnet
const vaultDaiAmount = 40000;

const vaults = {};

jest.setTimeout(50000);

beforeAll(async () => {
  maker = await instantiateMaker('mainnetfork');
  const proxyAddress = await maker.service('proxy').ensureProxy();

  //if ES hasn't been triggered, trigger ES and call cage on all ilks
  const end = maker.service('smartContract').getContract('MCD_END');
  const live = await end.live();
  if (live.toNumber() === 1) {
    for (let [ ilk , gem ] of filteredIlks) {
      await maker.getToken(gem).approveUnlimited(proxyAddress);
      let vaultCollateralAmount = ilk.substring(0,4) === 'ETH-' ? gem(50) : gem(4500);
      vaults[ilk] = await maker.service('mcd:cdpManager').openLockAndDraw(ilk, vaultCollateralAmount, vaultDaiAmount);
    }
    
    const token = maker.service('smartContract').getContract('MCD_GOV');
    const esm = maker.service('smartContract').getContract('MCD_ESM');
    await token.approve(esm.address, WAD.times(100000).toFixed());
    await esm.join(WAD.times(100000).toFixed());
    await esm.fire();
    const end = maker.service('smartContract').getContract('MCD_END');

    for (let ilkInfo of ilks) {
        const [ilk] = ilkInfo;
        await end['cage(bytes32)'](stringToBytes(ilk));
    }
  }
});

// test('overview', async () => {
//   const {
//     findByText,
//   } = await render(<Overview />, {
//     initialState: {
//       saiAvailable: SAI(0),
//       daiAvailable: DAI(0)
//     },
//     getMaker: maker => {
//       maker.service('cdp').getCdpIds = jest.fn(() => []);
//     }
//   });

//   await findByText('Withdraw Excess Collateral from Vaults', {timeout: 5000});
// });

test('the whole flow', async () => {
  const {
    findByText,
    findAllByTestId,
    getByTestId,
    getAllByTestId
  } = await render(<RedeemVaults />, {
    initialState: {
        vaultsToRedeem: {
            parsedVaultsData: 
            filteredIlks.map(i => {
              return {
              id: vaults[i[0]].id,
              type: i[2],
              ilk: i[0],
              collateral: '1 ' + i[2],
              daiDebt: '1.00 DAI',
              shutdownValue: '$---',
              exchangeRate: '1 DAI : --- ' + i[2],
              vaultValue: '1 ' + i[2]
              };
            })
        }
    }
  });
  await findByText('Withdraw Excess Collateral from Vaults');
  click(getByTestId('tosCheck'));

  async function withdraw(ilkInfo) {
    const [ilk, gem ] = ilkInfo;
    //there's two withdraw buttons, one for desktop, one for mobile
    const withdrawButton = getAllByTestId(`withdrawButton-${ilk}`)[0];
    const before = await maker.service('token').getToken(gem).balance();
    click(withdrawButton);
    await findAllByTestId(`successButton-${ilk}`);
    const after = await maker.service('token').getToken(gem).balance();
    expect(after.gt(before)).toBe(true);
  }

  for (let ilk of filteredIlks) {
    await withdraw(ilk);
    console.log('withdrew collateral from ', ilk[0], ' vault');
  }
  expect.assertions(filteredIlks.length);
});

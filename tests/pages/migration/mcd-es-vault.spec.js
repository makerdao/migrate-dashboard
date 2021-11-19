import RedeemVaults from '../../../pages/migration/vaults';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent } from '@testing-library/react';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import ilkList from '../../../references/ilkList';

const { click } = fireEvent;

let maker;

//UNIV2DAIETH-A isn't on the testchain yet
const ilks = ilkList.map(i => [i.symbol, i.currency, i.gem])
  .filter(i => i[0] !== 'UNIV2DAIETH-A');

//dust limit on the testchain. when updating the testchain this may need to be increased
const vaultDaiAmount = 100;

const vaults = {};

beforeAll(async () => {
  jest.setTimeout(50000);
  maker = await instantiateMaker('test');
  const proxyAddress = await maker.service('proxy').ensureProxy();

  for (let [ ilk , gem ] of ilks) {
    await maker.getToken(gem).approveUnlimited(proxyAddress);
    let vaultCollateralAmount = ilk.substring(0,4) === 'ETH-' ? gem(10) : gem(4500);
    vaults[ilk] = await maker.service('mcd:cdpManager').openLockAndDraw(ilk, vaultCollateralAmount, vaultDaiAmount);
  }

  //trigger ES, and get to the point that Vaults can be redeemed
  const token = maker.service('smartContract').getContract('MCD_GOV');
  await token['mint(uint256)'](WAD.times(50000).toFixed());
  const esm = maker.service('smartContract').getContract('MCD_ESM');
  await token.approve(esm.address, WAD.times(50000).toFixed());
  await esm.join(WAD.times(50000).toFixed());
  await esm.fire();
  const end = maker.service('smartContract').getContract('MCD_END');

  for (let [ilk,] of ilks) {
    await end['cage(bytes32)'](stringToBytes(ilk));
  }
});

test('overview', async () => {
  const {
    findByText,
  } = await render(<Overview />, {
    initialState: {
      saiAvailable: SAI(0),
      daiAvailable: DAI(0)
    },
    getMaker: maker => {
      maker.service('cdp').getCdpIds = jest.fn(() => []);
    }
  });

  await findByText('Withdraw Excess Collateral from Vaults', {timeout: 5000});
});

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
            ilks.map(i => {
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

  for (let ilk of ilks) {
    await withdraw(ilk);
  }
  expect.assertions(ilks.length);
});

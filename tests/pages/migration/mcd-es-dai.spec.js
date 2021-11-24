import RedeemDai from '../../../pages/migration/redeemDai';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker, SAI } from '../../../maker';
import { WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { DAI } from '@makerdao/dai-plugin-mcd';
const { change, click } = fireEvent;
import BigNumber from 'bignumber.js';
import ilkList from '../../../references/ilkList';
import { prettifyNumber } from '../../../utils/ui';

let maker;

//UNIV2DAIETH-A isn't on the testchain yet
const ilks = ilkList.map(i => [i.symbol, i.currency])
  .filter(i => i[0] !== 'UNIV2DAIETH-A');

//dust limit on the testchain. when updating the testchain this may need to be increased
const daiAmount = 100;

const dsrAmount = 0.5;
const minEndBalance = ilks.length * daiAmount - 1;

jest.setTimeout(9000000);

beforeAll(async () => {
  jest.setTimeout(9000000);
  maker = await instantiateMaker('test');
  const proxyAddress = await maker.service('proxy').ensureProxy();
  const vaults = {};

  for (let ilkInfo of ilks) {
    const [ilk, gem] = ilkInfo;
    await maker.getToken(gem).approveUnlimited(proxyAddress);
    vaults[ilk] = await maker
      .service('mcd:cdpManager')
      .openLockAndDraw(ilk, ilk.substring(0,4) === 'ETH-' ? gem(10) : gem(5000), daiAmount);
  }
  await maker.getToken(DAI).approveUnlimited(proxyAddress);
  await maker.service('mcd:savings').join(DAI(dsrAmount));

  //trigger ES, and get to the point that Dai can be cashed for all ilks
  const token = maker.service('smartContract').getContract('MCD_GOV');
  await token['mint(uint256)'](WAD.times(50000).toFixed());
  const esm = maker.service('smartContract').getContract('MCD_ESM');
  await token.approve(esm.address, WAD.times(50000).toFixed());
  await esm.join(WAD.times(50000).toFixed());
  await esm.fire();
  const end = maker.service('smartContract').getContract('MCD_END');
  for (let ilkInfo of ilks) {
      const [ilk] = ilkInfo;
      await end['cage(bytes32)'](stringToBytes(ilk));
  }
  const migVault = maker
    .service('migration')
    .getMigration('global-settlement-collateral-claims');

  for (let vault of Object.keys(vaults)) {
    await migVault.free(vaults[vault].id, vault);
  }

  await end.thaw();

  for (let ilkInfo of ilks) {
    const [ilk] = ilkInfo;
    await end.flow(stringToBytes(ilk));
  }
  await new Promise(r => setTimeout(r, 9000000));
});

test('overview', async () => {
  const { findByText } = await render(<Overview />, {
    initialState: {
      saiAvailable: SAI(0),
      daiAvailable: DAI(0)
    },
    getMaker: maker => {
      maker.service('cdp').getCdpIds = jest.fn(() => []);
    }
  });

  await findByText('Redeem Dai for collateral');
});

test('the whole flow', async () => {
  const {
    findByText,
    getByText,
    getByTestId,
    findAllByTestId,
    getAllByTestId,
    getAllByPlaceholderText
  } = await render(<RedeemDai />, {
    initialState: {
      proxyDaiAllowance: DAI(0),
      daiBalance: DAI(daiAmount * ilks.length - dsrAmount),
      endBalance: DAI(0),
      dsrBalance: DAI(dsrAmount),
      minEndVatBalance: BigNumber(minEndBalance),
      bagBalance: DAI(0),
      outAmounts: ilks.map(i => {
        return {
          ilk: i[0],
          out: BigNumber(0)
        };
      }),
      fixedPrices: ilks.map(i => {
        return {
          ilk: i[0],
          price: BigNumber(10)
        };
      }),
      tagPrices: ilks.map(i => {
        return {
          ilk: i[0],
          price: BigNumber(10)
        };
      })
    }
  });

  //proxy contract setup
  await findByText('Set up proxy contract');
  const continueButton = getByText('Continue');
  expect(continueButton.disabled).toBeTruthy();
  const allowanceButton = getByText('Set');
  await waitForElement(() => !allowanceButton.disabled);
  click(allowanceButton);
  await waitForElement(() => !continueButton.disabled);
  click(continueButton);

  //deposit dai
  await findByText('Deposit Dai to Redeem');
  click(getByText('Withdraw'));
  await findByText(prettifyNumber(daiAmount * ilks.length)+' DAI');
  const inputs = getAllByPlaceholderText('0.00 DAI');
  const input = inputs[2]; //first two are divs, third is the input element we want
  change(input, { target: { value: minEndBalance + 0.1 } });
  getByText(/Users cannot redeem more/);
  change(input, { target: { value: minEndBalance } });
  click(getByTestId('tosCheck'));
  const depositButton = getByText('Deposit');
  expect(depositButton.disabled).toBeFalsy();
  click(depositButton);

  //redeem dai
  await findByText('Redeem Dai');

  async function redeem(ilkInfo) {
    const [ilk, gem] = ilkInfo;
    //should be two buttons, one for mobile one for desktop
    const button = getAllByTestId(`redeemButton-${ilk}`)[0];
    const before = await maker.service('token').getToken(gem).balance();
    click(button);
    await findAllByTestId(`successButton-${ilk}`);
    const after = await maker.service('token').getToken(gem).balance();
    expect(after.gt(before));
  }

  for (let ilk of ilks) {
    await redeem(ilk);
  }
  expect.assertions(ilks.length);
});

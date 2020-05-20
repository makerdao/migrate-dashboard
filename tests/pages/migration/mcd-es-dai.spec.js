import RedeemDai from '../../../pages/migration/redeemDai';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker, SAI } from '../../../maker';
import esmAbi from '../../references/Esm';
import { esmAddress, WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { ETH, BAT, USDC } from '@makerdao/dai-plugin-mcd';
import { MDAI } from '@makerdao/dai-plugin-mcd';
const { change, click } = fireEvent;
import BigNumber from 'bignumber.js';

let maker;

const daiAmount = 1;
const dsrAmount = 0.5;
const minEndBalance = 0.1;

const ilks = [['ETH-A', ETH], ['BAT-A', BAT], ['USDC-A', USDC]];

beforeAll(async () => {
    maker = await instantiateMaker('test');
    const proxyAddress = await maker.service('proxy').ensureProxy();
    const vaults = {};
    await Promise.all(ilks.map(async (ilkInfo ) => {
      const [ ilk , gem ] = ilkInfo;
      await maker.getToken(gem).approveUnlimited(proxyAddress);
      vaults[ilk] = await maker.service('mcd:cdpManager').openLockAndDraw(ilk, gem(0.1), daiAmount);
    }));

    await maker.getToken(MDAI).approveUnlimited(proxyAddress);
    await maker.service('mcd:savings').join(MDAI(dsrAmount));

    //trigger ES, and get to the point that Dai can be cashed for all ilks
    const token = maker.service('smartContract').getContract('MCD_GOV');
    await token['mint(uint256)'](WAD.times(50000).toFixed());
    const esm = maker.service('smartContract').getContractByAddressAndAbi(esmAddress, esmAbi);
    await token.approve(esmAddress, -1); //approve unlimited
    await esm.join(WAD.times(50000).toFixed());
    await esm.fire();
    const end = maker.service('smartContract').getContract('MCD_END');
    await Promise.all(ilks.map(async (ilkInfo ) => {
      const [ ilk ,] = ilkInfo;
      await end['cage(bytes32)'](stringToBytes(ilk));
    }));
    const migVault = maker.service('migration')
      .getMigration('global-settlement-collateral-claims');

    await migVault.freeEth(vaults['ETH-A'].id);
    await migVault.freeBat(vaults['BAT-A'].id);
    await migVault.freeUsdc(vaults['USDC-A'].id);
    
    await end.thaw();
    await Promise.all(ilks.map(async (ilkInfo ) => {
      const [ ilk ,] = ilkInfo;
      await end.flow(stringToBytes(ilk));
    }));

});

test('overview', async () => {
  const {
    findByText,
  } = await render(<Overview />, {
    initialState: {
      saiAvailable: SAI(0),
      daiAvailable: MDAI(0)
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
    getByRole,
    getByTestId,
    findAllByTestId,
    getAllByTestId
  } = await render(<RedeemDai />, {
    initialState: {
        proxyDaiAllowance: MDAI(0),
        daiBalance: MDAI(daiAmount*ilks.length - dsrAmount),
        endBalance: MDAI(0),
        dsrBalance: MDAI(dsrAmount),
        minEndVatBalance: BigNumber(minEndBalance),
        bagBalance: MDAI(0),
        outAmounts: [{ilk: 'ETH-A', out: BigNumber(0)},{ilk: 'BAT-A', out: BigNumber(0)},{ilk: 'USDC-A', out: BigNumber(0)}],
        fixedPrices: [{ilk: 'ETH-A', price: BigNumber(10)},{ilk: 'BAT-A', price: BigNumber(10)},{ilk: 'USDC-A', price: BigNumber(10)}],
        tagPrices: [{ilk: 'ETH-A', price: BigNumber(10)},{ilk: 'BAT-A', price: BigNumber(10)},{ilk: 'USDC-A', price: BigNumber(10)}]
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
  await findByText('3.00 DAI');//daiAmount
  change(getByRole('textbox'), { target: { value: minEndBalance + .1 } });
  getByText(/Users cannot redeem more/);
  change(getByRole('textbox'), { target: { value: minEndBalance } });
  click(getByTestId('tosCheck'));
  const depositButton = getByText('Deposit');
  expect(depositButton.disabled).toBeFalsy();
  click(depositButton);

  //redeem dai
  await findByText('Redeem Dai');

  async function redeem(ilkInfo) {
    const [ ilk, gem ] = ilkInfo;
    //should be two buttons, one for mobile one for desktop
    const button = getAllByTestId(`redeemButton-${ilk}`)[0];
    const before = await maker.service('token').getToken(gem).balance();
    click(button);
    const after = await maker.service('token').getToken(gem).balance();
    await findAllByTestId(`successButton-${ilk}`);
    expect(after.gt(before));
  }

  await redeem(ilks[0]);
  await redeem(ilks[1]);
  await redeem(ilks[2]);
});
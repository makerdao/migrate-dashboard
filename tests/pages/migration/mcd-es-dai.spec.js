import RedeemDai from '../../../pages/migration/redeemDai';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker, SAI } from '../../../maker';
import esmAbi from '../../references/Esm';
import { esmAddress, WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { ETH } from '@makerdao/dai-plugin-mcd';
import { MDAI } from '@makerdao/dai-plugin-mcd';
const { change, click } = fireEvent;
import BigNumber from 'bignumber.js';

let maker;

beforeAll(async () => {
    jest.setTimeout(20000);
    maker = await instantiateMaker('test');
    const proxyAddress = await maker.service('proxy').ensureProxy();
    const vault = await maker.service('mcd:cdpManager').openLockAndDraw('ETH-A', ETH(0.1), 1);
    await maker.getToken(MDAI).approveUnlimited(proxyAddress, 0.5);
    await maker.service('mcd:savings').join(MDAI(.5));

    //trigger ES, and get to the point that Dai can be cashed for ETH-A
    const token = maker.service('smartContract').getContract('MCD_GOV');
    await token['mint(uint256)'](WAD.times(50000).toFixed());
    const esm = maker.service('smartContract').getContractByAddressAndAbi(esmAddress, esmAbi);
    await token.approve(esmAddress, -1); //approve unlimited
    await esm.join(WAD.times(50000).toFixed());
    await esm.fire();
    const end = maker.service('smartContract').getContract('MCD_END');
    await end['cage(bytes32)'](stringToBytes('ETH-A'));
    const migVault = maker.service('migration')
      .getMigration('global-settlement-collateral-claims');
    await migVault.freeEth(vault.id);
    await end.thaw();
    await end.flow(stringToBytes('ETH-A'));
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
    getAllByText,
    findAllByTestId
  } = await render(<RedeemDai />, {
    initialState: {
        proxyDaiAllowance: MDAI(0),
        daiBalance: MDAI(0.5),
        endBalance: MDAI(0),
        dsrBalance: MDAI(0.5),
        minEndVatBalance: BigNumber(.1),
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
  await findByText('1.00 DAI');
  change(getByRole('textbox'), { target: { value: .9 } });
  getByText(/Users cannot redeem more/);
  change(getByRole('textbox'), { target: { value: .1 } });
  click(getByTestId('tosCheck'));
  const depositButton = getByText('Deposit');
  expect(depositButton.disabled).toBeFalsy();
  click(depositButton);

  //redeem dai
  await findByText('Redeem Dai');
  const buttons = getAllByText('Redeem');
  // buttons.forEach(b => {
  //   console.log('b', b);
  //   click(b);
  // });
  // await findAllByTestId('successButton');
});
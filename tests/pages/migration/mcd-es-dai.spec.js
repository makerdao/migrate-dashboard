import RedeemDai from '../../../pages/migration/redeemDai';
import render from '../../helpers/render';
import { fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker } from '../../../maker';
import { DAI } from '@makerdao/dai/dist/src/eth/Currency';
import esmAbi from '../../references/Esm';
import BigNumber from 'bignumber.js';
import { stringToBytes } from '../../../utils/ethereum';
import { ETH } from '@makerdao/dai-plugin-mcd';

const { click } = fireEvent;

const esmAddress = '0xb002A319887185e56d787A5c90900e13834a85E3';
const WAD = new BigNumber('1e18');
let maker;

beforeAll(async () => {
    jest.setTimeout(20000);
    maker = await instantiateMaker('test');
    await maker.service('proxy').ensureProxy();
    const vault = await maker.service('mcd:cdpManager').openLockAndDraw('ETH-A', ETH(0.1), 1);
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

test('the whole flow', async () => {
  const {
    findByText,
    getByTestId,
    getByText
  } = await render(<RedeemDai />, {
    initialState: {
        proxyDaiAllowance: DAI(0),
        daiBalance: DAI(0),
        endBalance: DAI(0),
        dsrBalance: DAI(0)
    }
  });

  await findByText('Set up proxy contract');
  const continueButton = getByText('Continue');
  expect(continueButton.disabled).toBeTruthy();
  const allowanceButton = getByText('Set Allowance');
  await waitForElement(() => !allowanceButton.disabled);
  click(allowanceButton);
  //await waitForElement(() => !continueButton.disabled);
  //click(continueButton);
  //await findByText('Redeem Dai');
});
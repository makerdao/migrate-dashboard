import RedeemVaults from '../../../pages/migration/vaults';
import render from '../../helpers/render';
import { fireEvent } from '@testing-library/react';
import { instantiateMaker } from '../../../maker';
import esmAbi from '../../references/Esm';
import { esmAddress, WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
import { exportAllDeclaration } from '@babel/types';

const { click } = fireEvent;

let maker, id;

beforeAll(async () => {
  maker = await instantiateMaker('test');
  await maker.service('proxy').ensureProxy();
  const vault = await maker.service('mcd:cdpManager').openLockAndDraw('ETH-A', ETH(0.1), 1);
  id = vault.id;
  //trigger ES, and get to the point that Dai can be cashed for ETH-A
  const token = maker.service('smartContract').getContract('MCD_GOV');
  await token['mint(uint256)'](WAD.times(50000).toFixed());
  const esm = maker.service('smartContract').getContractByAddressAndAbi(esmAddress, esmAbi);
  await token.approve(esmAddress, -1); //approve unlimited
  await esm.join(WAD.times(50000).toFixed());
  await esm.fire();
  const end = maker.service('smartContract').getContract('MCD_END');
  await end['cage(bytes32)'](stringToBytes('ETH-A'));
});

test('the whole flow', async () => {
  const {
    findByText,
    findByTestId,
    getByTestId,
    getByText
  } = await render(<RedeemVaults />, {
    initialState: {
        vaultsToRedeem: {
            parsedVaultsData: [{
            collateral: '0.1 ETH',
            daiDebt: '1.00 DAI',
            exchangeRate: '1 DAI : 0.0005 ETH',
            id,
            shutdownValue: '$2,000.00',
            type: 'ETH',
            vaultValue: '0.0100 ETH'}]
        }
    }
  });
  await findByText('Withdraw Excess Collateral from Vaults');
  const withdrawButton = getByText('Withdraw');
  expect(withdrawButton.disabled).toBeTruthy();
  click(getByTestId('tosCheck'));
  expect(withdrawButton.disabled).toBeFalsy();
  const ethBefore = await maker.service('token').getToken(ETH).balance();
  click(withdrawButton);
  await findByTestId('successButton');
  const ethAfter = await maker.service('token').getToken(ETH).balance();
  expect(ethAfter.gt(ethBefore));
});
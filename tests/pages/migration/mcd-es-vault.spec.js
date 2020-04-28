import RedeemVaults from '../../../pages/migration/vaults';
import render from '../../helpers/render';
import { fireEvent } from '@testing-library/react';

const { click } = fireEvent;

test('the whole flow', async () => {
  const {
    findByText,
    getByTestId,
    getByText
  } = await render(<RedeemVaults />, {
    initialState: {
        vaultsToRedeem: {
            parsedVaultsData: [{
            collateral: '0.0100 BAT',
            daiDebt: '0.00 DAI',
            exchangeRate: '1 DAI : 0.0005 BAT',
            id: 29,
            shutdownValue: '$2,000.00',
            type: 'BAT',
            vaultValue: '0.0100 BAT'}]
        }
    }
  });
  await findByText('Withdraw Excess Collateral from Vaults');
  const withdrawButton = getByText('Withdraw');
  expect(withdrawButton.disabled).toBeTruthy();
  click(getByTestId('tosCheck'));
  expect(withdrawButton.disabled).toBeFalsy();
});
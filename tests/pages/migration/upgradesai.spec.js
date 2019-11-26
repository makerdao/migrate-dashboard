import UpgradeSai from '../../../pages/migration/dai';
import render from '../../helpers/render';
import { SAI, DAI } from '../../../maker';

test('basic rendering', async () => {
  const { getByText } = await render(<UpgradeSai />, {
    initialState: {
      saiBalance: SAI(100.789),
      daiAvailable: DAI(1000)
    }
  });
  getByText(/Upgrade Single-Collateral Sai/);
});

xtest('the whole flow', async () => {
  // set up test environment
  // generate some sai for test user
  const { getByText } = await render(<UpgradeSai />);
  // SCDRedeem
  // enter amount
  // click continue
  //
});

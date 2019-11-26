import DowngradeDai from '../../../pages/migration/sai';
import render from '../../helpers/render';
import { SAI, DAI } from '../../../maker';

test('basic rendering', async () => {
  const { getByText } = await render(<DowngradeDai />, {
    initialState: {
      daiBalance: DAI(100.789),
      saiAvailable: SAI(1000)
    }
  });
  getByText(/Convert Dai to Sai/);
});

import UpgradeSai from '../../../pages/migration/dai';
import render from '../../helpers/render';

test('basic rendering', async () => {
  const { getByText } = render(<UpgradeSai />);
  getByText(/Upgrade Single-Collateral Sai/);
});

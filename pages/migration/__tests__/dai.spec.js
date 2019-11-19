import UpgradeSai from '../dai';
import render from '../../../utils/testing/render';

test('basic rendering', async () => {
  const { getByText } = render(<UpgradeSai />);
  getByText(/Upgrade Single-Collateral Sai/);
});

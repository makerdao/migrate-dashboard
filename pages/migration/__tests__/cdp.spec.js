import MigrateCdp from '../cdp';
import render from '../../../utils/testing/render';

test('basic rendering', async () => {
  const { getByText } = render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

import MigrateCdp from '../../../pages/migration/cdp';
import render from '../../helpers/render';

test('basic rendering', async () => {
  const { getByText } = render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

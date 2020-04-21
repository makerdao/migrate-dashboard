import RedeemCollateral from '../../../pages/migration/scd-es-cdp';
import render from '../../helpers/render';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import {
  restoreSnapshot,
  takeSnapshot
} from '@makerdao/test-helpers/dist/snapshot';
import { instantiateMaker, PETH } from '../../../maker';

const { click } = fireEvent;

let maker, snapshotData, cdp1, cdp2, initialBalance;

beforeAll(async () => {
  jest.setTimeout(30000);
  maker = await instantiateMaker('test');
  snapshotData = await takeSnapshot(maker);

  cdp1 = await maker.openCdp();
  await cdp1.lockEth(1 + Math.random());
  await cdp1.drawDai(20 + Math.random() * 5);
  cdp2 = await maker
    .service('cdp')
    .openProxyCdpLockEthAndDrawDai(
      1 + Math.random(),
      20 + Math.random(),
      await maker.service('proxy').ensureProxy()
    );

  const top = maker.service('smartContract').getContract('SAI_TOP');
  await top.cage();
  await top.setCooldown(0);
  await cdp1.bite();
  await cdp2.bite();
  await new Promise(r => setTimeout(r, 1000));
  await top.flow();

  initialBalance = await maker.getToken('ETH').balance();
});

afterAll(async () => {
  if (snapshotData) await restoreSnapshot(snapshotData, maker);
});

test('the whole flow', async () => {
  const {
    debug, // eslint-disable-line no-unused-vars
    findByText,
    getAllByRole,
    getByTestId,
    getByText,
    queryAllByText
  } = await render(<RedeemCollateral />, {
    initialState: {
      pethInVaults: [
        [cdp1.id, PETH(await cdp1.getCollateralValue())],
        [cdp2.id, PETH(await cdp2.getCollateralValue())]
      ]
    }
  });

  await findByText('Redeem Sai CDPs for Collateral');
  // wait for WETH/PETH ratio to be fetched
  await waitForElementToBeRemoved(() => queryAllByText('...'));
  getAllByRole('checkbox').forEach(i => click(i));
  click(getByText('Continue'));
  
  await findByText('Confirm Transaction');
  click(getByTestId('tosCheck'));
  await findByText(/sign\s+3\s+transactions/m);
  click(getByText('Continue'));

  await findByText('Your collateral is being redeemed');

  await findByText('Redemption Complete', {}, {timeout: 15000});
  const received = getByTestId('received-collateral');
  const amount = parseFloat(received.textContent);
  console.log((await maker.getToken('WETH').balance()).toString());
  const finalBalance = await maker.getToken('ETH').balance();
  expect(finalBalance.minus(initialBalance).toNumber()).toBeCloseTo(amount);
});

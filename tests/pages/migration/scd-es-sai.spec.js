import RedeemSai from '../../../pages/migration/scd-es-sai';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import {
  restoreSnapshot,
  takeSnapshot
} from '@makerdao/test-helpers/dist/snapshot';
import { instantiateMaker, PETH, SAI, DAI } from '../../../maker';

const { click } = fireEvent;

let maker, snapshotData, cdp1, cdp2, initialBalance;

beforeAll(async () => {
  jest.setTimeout(30000);
  maker = await instantiateMaker('test');
  snapshotData = await takeSnapshot(maker);

  cdp1 = await maker.service('cdp').openCdp();
  await cdp1.lockEth(1 + Math.random());
  await cdp1.drawSai(20 + Math.random() * 5);
  cdp2 = await maker
    .service('cdp')
    .openProxyCdpLockEthAndDrawSai(
      1 + Math.random(),
      20 + Math.random(),
      await maker.service('proxy').ensureProxy()
    );

  const top = maker.service('smartContract').getContract('SAI_TOP');
  await top.cage();
  await top.setCooldown(0);
  await cdp1.bite();
  await new Promise(r => setTimeout(r, 1000));
  await top.flow();

  initialBalance = await maker.getToken('ETH').balance();
});

afterAll(async () => {
  if (snapshotData) await restoreSnapshot(snapshotData, maker);
});

test('overview', async () => {
  const { findByText } = await render(<Overview />, {
    initialState: {
      saiAvailable: SAI(100),
      daiAvailable: DAI(100)
    },
    getMaker: maker => {
      maker.service('cdp').getCdpIds = jest.fn(async owner => {
        if (owner === maker.currentAddress()) return [cdp1.id];
        if (owner === (await maker.currentProxy())) return [cdp2.id];
        throw new Error(`unrecognized address: ${owner}`);
      });
    }
  });

  await findByText('Redeem Sai for Collateral');
});
import MigrateCdp from '../../../pages/migration/cdp';
import { act } from '@testing-library/react';
import render from '../../helpers/render';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { ETH } from '@makerdao/dai-plugin-mcd'
import { mineBlocks, takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers'
import {
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react'

import Maker from '@makerdao/dai'
import McdPlugin from '@makerdao/dai-plugin-mcd'
import BigNumber from 'bignumber.js'
import round from 'lodash/round'
const { change, click } = fireEvent;

async function openLockAndDrawScdCdp(drawAmount, maker) {
  const proxy = await maker.service('proxy').currentProxy();
  const cdp = await maker.openCdp();
  await cdp.lockEth('20');
  await cdp.drawDai(drawAmount);
  await cdp.give(proxy);
  return cdp;
}

async function migrateSaiToDai(amount, maker) {
  const daiMigration = maker
    .service('migration')
    .getMigration('sai-to-dai');
    console.log('daiMigration', daiMigration.execute)
  await daiMigration.execute(SAI(amount));
}

afterEach(cleanup)

test('basic rendering', async () => {
  const { getByText } = await render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

/*test('show different messages depending on saiAvailable value', async () => {
  const { getByText, dispatch } = await render(<MigrateCdp />, {
    initialState: { saiAvailable: SAI(100.789) }
  });

  getByText(/CDPs with less than 20 or more than 100.79 SAI/);

  act(() => dispatch({ type: 'assign', payload: { saiAvailable: SAI(10) } }));
  getByText(/There is not enough Sai available/);
});
*/
test('not enough SAI', async () => {
  const { getByRole, getByText } = await render(<MigrateCdp />, {
    initialState: {
      saiAvailable: SAI(10)
    }
  })
  getByText(`There is not enough Sai available to migrate CDPs at this time. Please try again later.`)
})

describe('with live testchain', () => {
  let maker, saiAvailable, daiAvailable, snapshotData;
  let proxyCdp0, proxyCdp1, proxyCdp2, cdp
  let cdps = [];


  beforeEach(async () => {
    jest.setTimeout(20000)
    maker = await instantiateMaker('test')
    const proxy = await maker.service('proxy').currentProxy();
    console.log('proxy', proxy)
    // take a snapshot
    snapshotData = await takeSnapshot(maker);
    // create a proxy cdps
    proxyCdp0 = await maker.service('cdp').openProxyCdpLockEthAndDrawDai(10, 100, proxy)
    proxyCdp1 = await openLockAndDrawScdCdp(100, maker)
    proxyCdp2 = await openLockAndDrawScdCdp(10, maker)
    // create sai liquidity for migration contract
    const migrationContractAddress = maker
      .service('smartContract')
      .getContract('MIGRATION').address
    await maker.getToken('SAI').approveUnlimited(migrationContractAddress)
    const mig = maker.service('migration').getMigration('sai-to-dai');
    await mig.execute(SAI(50));

    // await migrateSaiToDai(50, maker)

    saiAvailable = await maker.getToken('SAI').balance();
    daiAvailable = await maker.getToken('MDAI').balance();
    console.log(saiAvailable.toNumber(), daiAvailable.toNumber())


  })

  afterEach(async () => {
    await restoreSnapshot(snapshotData, maker);
  });


  test('the whole flow', async () => {
    // const { getByText, getByRole, getByTestId } = await render(<MigrateCdp />, {
    //   initialState: {
    //
    //   }
    // })
  })
})

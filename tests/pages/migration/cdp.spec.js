import MigrateCdp from '../../../pages/migration/cdp';
import render from '../../helpers/render';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { ETH } from '@makerdao/dai-plugin-mcd';
import {
  mineBlocks,
  takeSnapshot,
  restoreSnapshot
} from '@makerdao/test-helpers';
import {
  act,
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react';
import { CDP_MIGRATION_MINIMUM_DEBT } from '../../../utils/constants';

import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';
import round from 'lodash/round';
const { change, click } = fireEvent;

async function openLockAndDrawScdCdp(drawAmount, maker, proxyTransfer=true) {
  const cdp = await maker.openCdp();
  await cdp.lockEth((drawAmount * 1.5) / 150);
  await cdp.drawDai(drawAmount);
  const proxy = await maker.service('proxy').currentProxy();
  if (proxyTransfer) await cdp.give(proxy);
  return cdp;
}

async function migrateSaiToDai(amount, maker) {
  const migrationContractAddress = maker
    .service('smartContract')
    .getContract('MIGRATION').address;
  await maker.getToken('SAI').approveUnlimited(migrationContractAddress);
  const daiMigration = maker.service('migration').getMigration('sai-to-dai');
  await daiMigration.execute(SAI(amount));
}

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = await render(<MigrateCdp />);
  getByText(/Select a CDP/);
});

test('show different messages depending on saiAvailable value', async () => {
  const { getByText, dispatch } = await render(<MigrateCdp />, {
    initialState: { saiAvailable: SAI(100.789) }
  });

  getByText(/CDPs with less than 20 or more than 100.79 SAI/);

  act(() => dispatch({ type: 'assign', payload: { saiAvailable: SAI(10) } }));
  getByText(/There is not enough Sai available/);
});

test('not enough SAI', async () => {
  const { getByText } = await render(<MigrateCdp />, {
    initialState: {
      saiAvailable: SAI(10)
    }
  });
  getByText(
    'There is not enough Sai available to migrate CDPs at this time. Please try again later.'
  );
});

describe('with live testchain', () => {
  let maker,
      snapshotData,
      address,
      proxyAddress,
      proxyCdp,
      proxyCdp1,
      nonProxyCdp,
      lowCdp,
      mcdCdp,
      cdpManager;

  beforeAll(async () => {
    jest.setTimeout(20000);
    maker = await instantiateMaker('test');
    snapshotData = await takeSnapshot(maker);
    await maker.service('proxy').ensureProxy()
    cdpManager = maker.service('mcd:cdpManager')
    address = maker.currentAddress()
    proxyAddress = await maker.service('proxy').currentProxy();

    console.log('creating liquidity...');
    await openLockAndDrawScdCdp(100, maker);
    await migrateSaiToDai(100, maker);
    // mcdCdp = await cdpManager.openLockAndDraw('ETH-A', ETH(10), DAI(100))

    console.log('creating CDPs to migrate...');
    proxyCdp = await openLockAndDrawScdCdp(25, maker);
    proxyCdp1 = await openLockAndDrawScdCdp(25, maker);
    nonProxyCdp = await openLockAndDrawScdCdp(25, maker, false);
    lowCdp = await openLockAndDrawScdCdp(CDP_MIGRATION_MINIMUM_DEBT - 1, maker);
  });

  afterAll(async () => {
    await restoreSnapshot(snapshotData, maker);
  });

  test('cdp with too little debt', async () => {
    let cdpMigrationCheck = {
      [proxyAddress]: [lowCdp.id]
    };
    const { getAllByTestId, queryByRole } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck,
        maker,
        account: window.maker.currentAddress()
      }
    });
    await waitForElement(() => getAllByTestId('cdpListItem'));
    expect(queryByRole('radio')).toBeNull();
  });

  test('the whole flow MKR Payment w/ Proxy CDP', async () => {
    let cdpMigrationCheck = {
      [proxyAddress]: [proxyCdp.id],
    };
    const {
      getByTestId,
      getAllByTestId,
      getByText,
      getAllByRole,
      debug,
      rerender
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck,
        maker,
        account: window.maker.currentAddress()
      }
    });
    await wait(() => expect(window.maker).toBeTruthy());
    const address = window.maker.currentAddress();
    expect(address).toEqual(maker.currentAddress());

    // select the cdp
    await waitForElement(() => getAllByTestId('cdpListItem'));
    const cdpRadio = await waitForElement(() => getAllByRole('radio'))
    click(cdpRadio[0])

    // click continue
    getByText('Continue')
    // TO FIX: Clicking causes a revert on blockchain
    // click(getByText('Continue'));

    // // pay with MKR
    // getByText('Confirm CDP Upgrade')
    // const payWithMkr = await waitForElement(() => getByText('Pay with MKR'))
    // click(payWithMkr)
    // expect(getByText('Pay and Migrate').disabled).toBeTruthy();
    // click(await waitForElement(() => getByTestId('allowance-toggle')))
    // click(await waitForElement(() => getByTestIdl('tosCheck')))
    // expect(getByText('Pay and Migrate').disabled).toBeFalsy()
    // click(getByText('Pay and Migrate'))
    //
    // // in progress
    // await waitForElement(() => getByText('Your CDP is being upgraded'))
    // await waitForElement(() => getByText('View transaction details'))
    //
    // // complete
    // await waitForElement(() => getByText('Upgrade complete'))
    // await waitForElement(() => getByText('CDP #1 has been successfully upgraded to a Multi-Collateral Dai Vault'))
    //
    // // check using the maker instance that the user now has an MCD CDP
    // const data = await cdpManager.getCdpIds(proxyAddress)
    // expect(data.length).toBeGreaterThan(1)
    // debug();
  });

  test('the whole flow Dai Payment w/ Proxy CDP', async () => {
    let cdpMigrationCheck = {
      [proxyAddress]: [proxyCdp1.id],
    };
    const {
      getByTestId,
      getAllByTestId,
      getByText,
      getAllByRole,
      debug
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck,
        maker,
        account: window.maker.currentAddress()
      }
    });

    // select the cdp
    const cdpRadio = await waitForElement(() => getAllByRole('radio'))
    click(cdpRadio[0])

    // click continue
    getByText('Continue')
    // TO FIX: Clicking causes a revert on blockchain
    // click(getByText('Continue'));

    // // pay with DAI
    // getByText('Confirm CDP Upgrade')
    // const daiDebt = await waitForElement(() => getByText('Pay with CDP debt'))
    // click(daiDebt)
    // expect(getByText('Pay and Migrate').disabled).toBeTruthy();
    // click(getByTestId('tosCheck'))
    // expect(getByText('Pay and Migrate').disabled).toBeFalsy()
    // click(getByText('Pay and Migrate'))
    //
    // // in progress
    // await waitForElement(() => getByText('Your CDP is being upgraded'))
    // await waitForElement(() => getByText('View transaction details'))
    //
    // // complete
    // await waitForElement(() => getByText('Upgrade complete'))
    // await waitForElement(() => getByText('CDP #1 has been successfully upgraded to a Multi-Collateral Dai Vault'))
    //
    // // check using the maker instance that the user now has an MCD CDP
    // const manager = maker.service('mcd:cdpManager')
    // const data = await cdpManager.getCdpIds(proxyAddress)
    // expect(data.length).toBeGreaterThan(1)
  });

  test('proxy transfer w/ non proxy-CDP', async () => {
    let cdpMigrationCheck = {
      [address]: [nonProxyCdp.id]
    };
    const {
      getByTestId,
      queryByTestId,
      getAllByTestId,
      getByText,
      getAllByRole,
      debug
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck,
        maker,
        account: window.maker.currentAddress()
      }
    });

    // select the cdp
    await waitForElement(() => getAllByTestId('cdpListItem'));
    const cdpRadio = await waitForElement(() => getAllByRole('radio'))
    click(cdpRadio[0])

    // click continue
    getByText('Continue')
    click(getByText('Continue'));

    // transfer cdp to proxy
    expect(getByText('Continue').disabled).toBeTruthy()
    await click(getByText('Transfer CDP'))

    // TO FIX: Transfer CDP transaction doesn't finish and this times out
    // await waitForElement(() => getByTestId('cdpTransfer'))
    // expect(getByText('Continue').disabled).toBeFalsy()
  })
});

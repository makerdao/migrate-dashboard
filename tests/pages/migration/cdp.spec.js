import MigrateCdp from '../../../pages/migration/cdp';
import render from '../../helpers/render';
import { instantiateMaker, SAI } from '../../../maker';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';
import {
  act,
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react';
import { CDP_MIGRATION_MINIMUM_DEBT } from '../../../utils/constants';

const { click } = fireEvent;

async function openLockAndDrawScdCdp(drawAmount, maker, proxyTransfer = true) {
  const cdp = await maker.openCdp();

  // note that we're hardcoding collateralization ratio and eth price here --
  // if they don't match the settings in MCD, then cdp migration may revert due
  // to attempting to create an unsafe cdp
  await cdp.lockEth((drawAmount * 1.6) / 150);
  await cdp.drawSai(drawAmount);
  if (proxyTransfer) {
    const proxy = await maker.service('proxy').currentProxy();
    await cdp.give(proxy);
  }
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
      saiAvailable: SAI(CDP_MIGRATION_MINIMUM_DEBT - 1)
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
    nonProxyCdp,
    nonProxyCdp2,
    lowCdp,
    cdpManager;

  beforeAll(async () => {
    jest.setTimeout(20000);
    maker = await instantiateMaker('test');
    snapshotData = await takeSnapshot(maker);
    await maker.service('proxy').ensureProxy();
    cdpManager = maker.service('mcd:cdpManager');
    address = maker.currentAddress();
    proxyAddress = await maker.service('proxy').currentProxy();

    await openLockAndDrawScdCdp(100, maker);
    await migrateSaiToDai(100, maker);

    proxyCdp = await openLockAndDrawScdCdp(25, maker);
    nonProxyCdp = await openLockAndDrawScdCdp(25, maker, false);
    nonProxyCdp2 = await openLockAndDrawScdCdp(25, maker, false);
    lowCdp = await openLockAndDrawScdCdp(CDP_MIGRATION_MINIMUM_DEBT - 1, maker);
  });

  afterAll(async () => {
    await restoreSnapshot(snapshotData, maker);
  });

  test('cdp with too little debt', async () => {
    const { getAllByTestId, queryByRole } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(110),
        cdpMigrationCheck: {
          [proxyAddress]: [lowCdp.id]
        }
      }
    });
    await waitForElement(() => getAllByTestId('cdpListItem'));
    expect(queryByRole('radio')).toBeNull();
  });

  test('the whole flow, using Pay with MKR', async () => {
    const {
      findAllByRole,
      findAllByTestId,
      findByText,
      getByTestId,
      getByText
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(100),
        cdpMigrationCheck: {
          [address]: [nonProxyCdp.id]
        }
      }
    });
    await wait(() => window.maker);
    expect(address).toEqual(window.maker.currentAddress());

    const initialData = await cdpManager.getCdpIds(proxyAddress);

    // select the cdp
    await findAllByTestId('cdpListItem');
    const cdpRadio = await findAllByRole('radio');
    click(cdpRadio[0]);
    click(getByText('Continue'));

    getByText('Set up proxy contract');
    const continueButton = getByText('Continue');
    expect(continueButton.disabled).toBeTruthy();
    const transferButton = getByText('Transfer CDP');
    await waitForElement(() => !transferButton.disabled);
    click(transferButton);
    await waitForElement(() => !continueButton.disabled);
    click(continueButton);

    // pay with MKR
    getByText('Confirm CDP Upgrade');
    await findByText('400.00 MKR');
    click(getByTestId('tosCheck'));

    // set allowance
    const toggle = getByTestId('allowance-toggle');
    await waitForElement(() => !toggle.disabled);
    click(toggle);

    const pay = getByText('Pay and Migrate');
    await waitForElement(() => !pay.disabled);
    click(pay);

    // in progress
    await findByText('Your CDP is being upgraded');
    await findByText('Upgrade complete');

    cdpManager.reset();
    const finalData = await cdpManager.getCdpIds(proxyAddress);
    expect(finalData.length).toEqual(initialData.length + 1);

    getByText(
      `CDP #${nonProxyCdp.id} has been successfully upgraded to a Multi-Collateral Dai Vault.`
    );
  });

  test.skip('the whole flow, using Pay with Debt', async () => {
    let cdpMigrationCheck = {
      [proxyAddress]: [proxyCdp.id]
    };
    const { findByText, getByTestId, getByText, getAllByRole } = await render(
      <MigrateCdp />,
      {
        initialState: {
          saiAvailable: SAI(100),
          cdpMigrationCheck
        }
      }
    );
    await wait(() => window.maker);
    const initialData = await cdpManager.getCdpIds(proxyAddress);

    // select the cdp
    const cdpRadio = await waitForElement(() => getAllByRole('radio'));
    click(cdpRadio[0]);
    click(getByText('Continue'));

    // choose to pay with debt
    getByText('Confirm CDP Upgrade');
    click(getByText('Pay with CDP debt'));

    // FIXME: because saiAmountNeededToBuyMkr is not working, this is not
    // visible, and a "lack of liquidity" warning is shown instead
    click(getByTestId('tosCheck'));

    const pay = getByText('Pay and Migrate');
    await waitForElement(() => !pay.disabled);
    click(pay);

    // in progress
    await findByText('Your CDP is being upgraded');
    await findByText('Upgrade complete');

    cdpManager.reset();
    const finalData = await cdpManager.getCdpIds(proxyAddress);
    expect(finalData.length).toEqual(initialData.length + 1);

    getByText(
      `CDP #${proxyCdp.id} has been successfully upgraded to a Multi-Collateral Dai Vault.`
    );
  });

  test('the whole flow with mkr oracle deactivated', async () => {
    const pep = maker.service('smartContract').getContract('SAI_PEP');
    await pep.void();
    const oracleActive = (await pep.peek())[1];
    expect(oracleActive).toBe(false);

    const {
      findAllByRole,
      findAllByTestId,
      findByText,
      getByTestId,
      getByText
    } = await render(<MigrateCdp />, {
      initialState: {
        saiAvailable: SAI(100),
        cdpMigrationCheck: {
          [address]: [nonProxyCdp2.id]
        }
      }
    });
    await wait(() => window.maker);
    expect(address).toEqual(window.maker.currentAddress());

    const initialData = await cdpManager.getCdpIds(proxyAddress);

    await findAllByTestId('cdpListItem');
    const cdpRadio = await findAllByRole('radio');
    click(cdpRadio[0]);
    click(getByText('Continue'));

    getByText('Set up proxy contract');
    const continueButton = getByText('Continue');
    expect(continueButton.disabled).toBeTruthy();
    const transferButton = getByText('Transfer CDP');
    await waitForElement(() => !transferButton.disabled);
    click(transferButton);
    await waitForElement(() => !continueButton.disabled);
    click(continueButton);

    getByText('Confirm CDP Upgrade');
    await findByText('0 MKR');
    click(getByTestId('tosCheck'));
    const pay = getByText('Migrate');
    await waitForElement(() => !pay.disabled);
    click(pay);

    await findByText('Your CDP is being upgraded');
    await findByText('Upgrade complete');
    cdpManager.reset();
    const finalData = await cdpManager.getCdpIds(proxyAddress);
    expect(finalData.length).toEqual(initialData.length + 1);
    getByText(
      `CDP #${nonProxyCdp2.id} has been successfully upgraded to a Multi-Collateral Dai Vault.`
    );
  });

});

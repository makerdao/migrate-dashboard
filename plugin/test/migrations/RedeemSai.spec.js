import { migrationMaker } from '../helpers';
import { ServiceRoles, Migrations } from '../../src/constants';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';
import { SAI } from '../../src';
import { getCurrency } from '@makerdao/currency';
import { DAI } from '@makerdao/dai/dist/src/eth/Currency';

let cdp, maker, migration, snapshotData;

async function shutDownScd() {
  const top = maker.service('smartContract').getContract('SAI_TOP');
  cdp = await openLockAndDrawScdCdp();
  await top.cage();
  await cdp.bite();
  SAI
}

async function openLockAndDrawScdCdp() {
  const cdp = await maker.openCdp();
  await cdp.lockEth(1);
  await cdp.drawDai(10);
  return cdp;
}

describe('Redeem Sai', () => {
  beforeAll(async () => {
    maker = await migrationMaker();
    snapshotData = await takeSnapshot(maker);
    const service = maker.service(ServiceRoles.MIGRATION);
    migration = service.getMigration(Migrations.REDEEM_SAI);
    await shutDownScd();
  });

  afterAll(async () => {
    await restoreSnapshot(snapshotData, maker);
  });

  test('should be off after shutdown', async () => {
    const off = await migration.off();
    expect(off).toBe(true);
  })

  test('should get the exchange rate', async () => {
    const rate = await migration.getRate();
    expect(rate).toBe(0.0025);
  });

  test('should get the collateral pending liquidation', async () => {
    const fog = await migration.fog();
    expect(fog).toBe(0.025);
  });

  test('should redeem sai', async () => {
    const sai = maker.getToken('DAI');
    const gem = maker.getToken('WETH');
    const address = maker.service('web3').currentAddress();
    await sai.approveUnlimited(migration._tap.address);
    const saiBalanceBeforeRedemption = await sai.balanceOf(address);
    const wethBalanceBeforeRedemption = await gem.balanceOf(address);
    await migration.redeemSai(5);
    const saiBalanceAfterRedemption = await sai.balanceOf(address);
    const wethBalanceAfterRedemption = await gem.balanceOf(address);

    expect(saiBalanceBeforeRedemption.toNumber()).toBe(10);
    expect(saiBalanceAfterRedemption.toNumber()).toBe(5);
    expect(wethBalanceBeforeRedemption.toNumber()).toBe(0);
    expect(wethBalanceAfterRedemption.toNumber()).toBe(0.0125);
  });
});
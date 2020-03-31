import { migrationMaker, shutDown } from '../helpers';
import { ServiceRoles, Migrations } from '../../src/constants';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';

let maker, migration, snapshotData;

describe('Redeem Sai', () => {
  beforeAll(async () => {
    maker = await migrationMaker();
    snapshotData = await takeSnapshot(maker);
    const service = maker.service(ServiceRoles.MIGRATION);
    migration = service.getMigration(Migrations.REDEEM_SAI);
    await shutDown();
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
    expect(fog).toBe(0.075);
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

    expect(saiBalanceBeforeRedemption.toNumber()).toBe(30);
    expect(saiBalanceAfterRedemption.toNumber()).toBe(25);
    expect(wethBalanceBeforeRedemption.toNumber()).toBe(0);
    expect(wethBalanceAfterRedemption.toNumber()).toBe(0.0125);
  });
});
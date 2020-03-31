import { migrationMaker, shutDown } from '../helpers';
import { ServiceRoles, Migrations } from '../../src/constants';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';

let maker, migration, snapshotData;

describe('Redeem collateral', () => {
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
  
  test('hello', async () => {
    console.log(migration);
  });
});
# migrate-dashboard
Migration dashboard

The migrate dashboard provides a user interface for these migrations in Emergency Shutdown:

- Redeem SCD Sai for underlying collateral
- Claim excess collateral in SCD CDP
- Redeem MCD Dai for underlying collateral
- Claim excess collateral in MCD Vault

The migration portal no longer supports the scd → mcd migrations that took advantage of the migration contract, since that contract has been decommissioned

In addition to Emergency Shutdown, the migration portal checks for:

- old MKR tokens that can be redeemed to the current MKR, and directs holders to [redeem.makerdao.com/](https://redeem.makerdao.com/)
- MKR locked in the old Chief, and directs holders to [chief-migration.makerdao.com/](https://chief-migration.makerdao.com/).  Note that this is for the v1.0 chief, migration for the v1.1 chief is handled in the [governance portal](https://vote.makerdao.com/).

# testing

```
yarn test
```
or 

```
yarn test:mcd //run the mcd dai and mcd vault tests
```

The mcd dai and mcd vault tests were updated to test against a fork of mainnet using hardhat (instead of the old local ganache testchain). For now, the other tests do not work.

The UI can also be used with the local testchain, with these steps:
(note: this needs to be updated to work with the recent hardhat changes)

- add the query string `testnet` to the url, e.g.`localhost:3000?testnet`
- switch metamask to point to the testchain (should be localhost:2000)
- import the default account for the testchain to your metamask. Private key can be found [here](https://github.com/makerdao/testchain/issues/31#issuecomment-616816206)
- Get the testchain into the state you want it by running the relevant test until the point you want it to pause (see commented out setTimeouts in code).  This is a bit hacky, and can probably be improved with snapshots.
- To test the scd cdp flow, you'll want to include `scdes` in the query string to tell dai.js to use mock data when getting the cdps. e.g. `localhost:3000?scdestestnet`

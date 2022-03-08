/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

import RedeemDai from '../../pages/migration/redeemDai';
import { instantiateMaker, SAI } from '../../maker';
import { WAD } from '../references/constants';
import { stringToBytes } from '../../utils/ethereum';
import { DAI } from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';
import ilkList from '../../references/ilkList';
import { prettifyNumber } from '../../utils/ui';
import { elementContainsText, forkNetwork, setAccount, visitPage } from '../support/commons';

let maker;

const ilks = ilkList.map(i => [i.symbol, i.currency]);

const daiAmount = 1000; //number of dai created in fund script
const minEndBalance = daiAmount - 1;

//jest.setTimeout(9000000);
jest.setTimeout(70000);

beforeAll(async () => {
  maker = await instantiateMaker('mainnetfork');
  const proxyAddress = await maker.service('proxy').ensureProxy();

  await maker.getToken(DAI).approveUnlimited(proxyAddress);
  //trigger ES, and get to the point that Dai can be cashed for all ilks
  const token = maker.service('smartContract').getContract('MCD_GOV');
  const esm = maker.service('smartContract').getContract('MCD_ESM');
  await token.approve(esm.address, WAD.times(100000).toFixed());
  await esm.join(WAD.times(100000).toFixed());
  await esm.fire();
  const end = maker.service('smartContract').getContract('MCD_END');

  for (let ilkInfo of ilks) {
      const [ilk] = ilkInfo;
      await end['cage(bytes32)'](stringToBytes(ilk));
  }

const vat = maker.service('smartContract').getContract('MCD_VAT');
const vow = maker.service('smartContract').getContract('MCD_VOW');
const vowAddress = maker.service('smartContract').getContractAddress('MCD_VOW');
const vowDai = await vat.dai(vowAddress);

await end.skim(stringToBytes('ETH-A'), '0xb09c349b0B60FeA600a55a7e2f9Be817D132a714');

await vow.heal(vowDai.toString());

  await end.thaw();

  for (let ilkInfo of ilks) {
    const [ilk] = ilkInfo;
    console.log('calling flow on ilk', ilk);
    await end.flow(stringToBytes(ilk));
  }
  cy.log('done setting up');
});

test('the whole flow', async () => {
  visitPage('/overview');
  cy.log('finished test');
  //expect.assertions(ilks.length);
});
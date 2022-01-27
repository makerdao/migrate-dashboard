/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

import RedeemDai from '../../pages/migration/redeemDai';
// import Overview from '../../pages/overview';
import { fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker, SAI } from '../../maker';
// import { WAD } from '../references/constants';
// import { stringToBytes } from '../../utils/ethereum';
import { DAI } from '@makerdao/dai-plugin-mcd';
// const { change, click } = fireEvent;
// import BigNumber from 'bignumber.js';
// import ilkList from '../../references/ilkList';
// import { prettifyNumber } from '../../utils/ui';

let maker;

describe('MCD Dai Redeem', async () => {

    //dust limit on the testchain. when updating the testchain this may need to be increased
    const daiAmount = 100;

    const dsrAmount = 0.5;
    const minEndBalance = ilks.length * daiAmount - 1;

    jest.setTimeout(70000);

    beforeAll(async () => {
      maker = await instantiateMaker('test');
      const proxyAddress = await maker.service('proxy').ensureProxy();
      const vaults = {};

      for (let ilkInfo of ilks) {
          const [ilk, gem] = ilkInfo;
          await maker.getToken(gem).approveUnlimited(proxyAddress);
          vaults[ilk] = await maker
          .service('mcd:cdpManager')
          .openLockAndDraw(ilk, ilk.substring(0,4) === 'ETH-' ? gem(10) : gem(5000), daiAmount);
      }
      await maker.getToken(DAI).approveUnlimited(proxyAddress);
      await maker.service('mcd:savings').join(DAI(dsrAmount));
      cy.log('finish setting up!');
    });

  it('whole flow', () => {

    mount(<RedeemDai/>)
    cy.log('whole flow');
  });
});
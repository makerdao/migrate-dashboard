import RedeemDai from '../../../pages/migration/redeemDai';
import render from '../../helpers/render';
import { fireEvent, waitForElement } from '@testing-library/react';
import { instantiateMaker, SAI } from '../../../maker';
import { WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { DAI } from '@makerdao/dai-plugin-mcd';
const { change, click } = fireEvent;
import BigNumber from 'bignumber.js';
import ilkList from '../../../references/ilkList';
import { prettifyNumber } from '../../../utils/ui';

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

  //note: the address passed in here is often an UrnHandler address
  //to get an Urn address, first find the CDP number on something like blockanalytica
  //then pass that number into the cdp manager's 'urns' mapping
  await end.skim(stringToBytes('ETH-A'), '0xb09c349b0B60FeA600a55a7e2f9Be817D132a714');
  await end.skim(stringToBytes('ETH-B'), '0x260E30F4CC513614253A4de9BFE754B0d958ef63');
  await end.skim(stringToBytes('PSM-USDC-A'), '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A');

  await vow.heal(vowDai.toString());

  await end.thaw();

  for (let ilkInfo of ilks) {
    const [ilk] = ilkInfo;
    console.log('calling flow on ilk', ilk);
    await end.flow(stringToBytes(ilk));
  }
});

test('the whole flow', async () => {
  const {
    findByText,
    getByText,
    getByTestId,
    findAllByTestId,
    getAllByTestId,
    getAllByPlaceholderText
  } = await render(<RedeemDai />, {
    initialState: {
      proxyDaiAllowance: DAI(0),
      daiBalance: DAI(daiAmount),
      endBalance: DAI(0),
      dsrBalance: DAI(0),
      minEndVatBalance: BigNumber(minEndBalance),
      bagBalance: DAI(0),
      outAmounts: ilks.map(i => {
        return {
          ilk: i[0],
          out: BigNumber(0)
        };
      }),
      fixedPrices: ilks.map(i => {
        return {
          ilk: i[0],
          price: BigNumber(10)
        };
      }),
      tagPrices: ilks.map(i => {
        return {
          ilk: i[0],
          price: BigNumber(10)
        };
      })
    },
    network: 'mainnetfork'
  });
  console.log('beginning test');
  //proxy contract setup
  await findByText('Set up proxy contract');
  const continueButton = getByText('Continue');
  expect(continueButton.disabled).toBeTruthy();
  const allowanceButton = getByText('Set');
  await waitForElement(() => !allowanceButton.disabled);
  click(allowanceButton);
  await waitForElement(() => !continueButton.disabled);
  click(continueButton);
  //deposit dai
  await findByText('Deposit Dai to Redeem');
  await findByText(prettifyNumber(daiAmount)+' DAI');
  const inputs = getAllByPlaceholderText('0.00 DAI');
  const input = inputs[2]; //first two are divs, third is the input element we want
  change(input, { target: { value: minEndBalance + 0.1 } });
  getByText(/Users cannot redeem more/);
  change(input, { target: { value: 1 } }); //redeem 1 dai
  click(getByTestId('tosCheck'));
  const depositButton = getByText('Deposit');
  expect(depositButton.disabled).toBeFalsy();
  click(depositButton);
  //redeem dai
  await findByText('Redeem Dai');

  async function redeem(ilkInfo) {
    const [ilk, gem] = ilkInfo;
    //should be two buttons, one for mobile one for desktop
    const button = getAllByTestId(`redeemButton-${ilk}`)[0];
    const before = await maker.service('token').getToken(gem).balance();
    click(button);
    await findAllByTestId(`successButton-${ilk}`);
    const after = await maker.service('token').getToken(gem).balance();
    expect(after.gt(before));
  }

  for (let ilk of ilks) {
    await redeem(ilk);
  }
  expect.assertions(ilks.length);
});
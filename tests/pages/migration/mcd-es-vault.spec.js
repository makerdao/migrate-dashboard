import RedeemVaults from '../../../pages/migration/vaults';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent } from '@testing-library/react';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { ETH, BAT, USDC } from '@makerdao/dai-plugin-mcd';

const { click } = fireEvent;

let maker;

const ilks = [['ETH-A', ETH], ['BAT-A', BAT], ['USDC-A', USDC]];

beforeAll(async () => {
  maker = await instantiateMaker('test');
  const proxyAddress = await maker.service('proxy').ensureProxy();
  await Promise.all(ilks.map(async (ilkInfo ) => {
    const [ ilk , gem ] = ilkInfo;
    await maker.getToken(gem).approveUnlimited(proxyAddress);
    await maker.service('mcd:cdpManager').openLockAndDraw(ilk, gem(0.2), 1);
  }));

  //trigger ES, and get to the point that Vaults can be redeemed
  const token = maker.service('smartContract').getContract('MCD_GOV');
  await token['mint(uint256)'](WAD.times(50000).toFixed());
  const esm = maker.service('smartContract').getContract('MCD_ESM');
  await token.approve(esm.address, -1); //approve unlimited
  await esm.join(WAD.times(50000).toFixed());
  await esm.fire();
  const end = maker.service('smartContract').getContract('MCD_END');
  await Promise.all(ilks.map(async ([ilk,]) => {
    await end['cage(bytes32)'](stringToBytes(ilk));
  }));

});

test('overview', async () => {
  const {
    findByText,
  } = await render(<Overview />, {
    initialState: {
      saiAvailable: SAI(0),
      daiAvailable: DAI(0)
    },
    getMaker: maker => {
      maker.service('cdp').getCdpIds = jest.fn(() => []);
    }
  });

  await findByText('Withdraw Excess Collateral from Vaults');
});

test('the whole flow', async () => {
  const {
    findByText,
    findAllByTestId,
    getByTestId,
    getAllByTestId
  } = await render(<RedeemVaults />, {
    initialState: {
        vaultsToRedeem: {
            parsedVaultsData: [
            { id: 3,
              type: 'USDC',
              ilk: 'USDC-A',
              collateral: '100,000,000,000.00 USDC',
              daiDebt: '1.00 DAI',
              shutdownValue: '$1.00',
              exchangeRate: '1 DAI : 1.0000 USDC',
              vaultValue: '99,999,999,999.00 USDC' },
            { id: 2,
              type: 'BAT',
              ilk: 'BAT-A',
              collateral: '0.20 BAT',
              daiDebt: '1.00 DAI',
              shutdownValue: '$40.00',
              exchangeRate: '1 DAI : 0.0250 BAT',
              vaultValue: '0.08 BAT' },
            {
            collateral: '0.2 ETH',
            daiDebt: '1.00 DAI',
            exchangeRate: '1 DAI : 0.0005 ETH',
            id: 1,
            shutdownValue: '$2,000.00',
            type: 'ETH',
            ilk: 'ETH-A',
            vaultValue: '0.0100 ETH'}]
        }
    }
  });
  await findByText('Withdraw Excess Collateral from Vaults');
  click(getByTestId('tosCheck'));

  async function withdraw(ilkInfo) {
    const [ilk, gem ] = ilkInfo;
    //there's two withdraw buttons, one for desktop, one for mobile
    const withdrawButton = getAllByTestId(`withdrawButton-${ilk}`)[0];
    const before = await maker.service('token').getToken(gem).balance();
    click(withdrawButton);
    await findAllByTestId(`successButton-${ilk}`);
    const after = await maker.service('token').getToken(gem).balance();
    expect(after.gt(before)).toBe(true);
  }

  //running consecutively seems to make nonce issues happen less on testchain
  await withdraw(ilks[0]);
  await withdraw(ilks[1]);
  await withdraw(ilks[2]);
  expect.assertions(ilks.length);
});

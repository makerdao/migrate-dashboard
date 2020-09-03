import RedeemVaults from '../../../pages/migration/vaults';
import Overview from '../../../pages/overview';
import render from '../../helpers/render';
import { fireEvent } from '@testing-library/react';
import { instantiateMaker, SAI, DAI } from '../../../maker';
import { WAD } from '../../references/constants';
import { stringToBytes } from '../../../utils/ethereum';
import { ETH, BAT, USDC, WBTC, ZRX } from '@makerdao/dai-plugin-mcd';

const { click } = fireEvent;

let maker;

const ilks = [
  ['ETH-A', ETH],
  ['BAT-A', BAT],
  ['USDC-A', USDC],
  ['USDC-B', USDC],
  ['WBTC-A', WBTC],
  ['ZRX-A', ZRX]
];

beforeAll(async () => {
  maker = await instantiateMaker('test');
  const proxyAddress = await maker.service('proxy').ensureProxy();

  async function setupVault(ilkInfo) {
    const [ ilk , gem ] = ilkInfo;
    await maker.getToken(gem).approveUnlimited(proxyAddress);
    await maker.service('mcd:cdpManager').openLockAndDraw(ilk, gem(1), 1);
  }

  //calling consecutively ensures 1st ilk gets id #1, etc. and seems to help with nonce issues
  await setupVault(ilks[0]);
  await setupVault(ilks[1]);
  await setupVault(ilks[2]);
  await setupVault(ilks[3]);
  await setupVault(ilks[4]);
  await setupVault(ilks[5]);

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
            { id: ilks.findIndex(i => i[0]==='ZRX-A')+1,
            type: 'ZRX',
            ilk: 'ZRX-A',
            collateral: '1 ZRX',
            daiDebt: '1.00 DAI',
            shutdownValue: '$10,000.00',
            exchangeRate: '1 DAI : 0.0001 ZRX',
            vaultValue: '0.02 ZRX' },
            { id: ilks.findIndex(i => i[0]==='KNC-A')+1,
            type: 'KNC',
            ilk: 'KNC-A',
            collateral: '1 KNC',
            daiDebt: '1.00 DAI',
            shutdownValue: '$10,000.00',
            exchangeRate: '1 DAI : 0.0001 KNC',
            vaultValue: '0.02 KNC' },
            { id: ilks.findIndex(i => i[0]==='WBTC-A')+1,
              type: 'WBTC',
              ilk: 'WBTC-A',
              collateral: '1 WBTC',
              daiDebt: '1.00 DAI',
              shutdownValue: '$10,000.00',
              exchangeRate: '1 DAI : 0.0001 WBTC',
              vaultValue: '0.02 WBTC' },
            { id: ilks.findIndex(i => i[0]==='USDC-B')+1,
              type: 'USDC',
              ilk: 'USDC-B',
              collateral: '100,000,000,000.00 USDC',
              daiDebt: '1.00 DAI',
              shutdownValue: '$1.00',
              exchangeRate: '1 DAI : 1.0000 USDC',
              vaultValue: '99,999,999,999.00 USDC' },
            { id: ilks.findIndex(i => i[0]==='USDC-A')+1,
              type: 'USDC',
              ilk: 'USDC-A',
              collateral: '100,000,000,000.00 USDC',
              daiDebt: '1.00 DAI',
              shutdownValue: '$1.00',
              exchangeRate: '1 DAI : 1.0000 USDC',
              vaultValue: '99,999,999,999.00 USDC' },
            { id: ilks.findIndex(i => i[0]==='BAT-A')+1,
              type: 'BAT',
              ilk: 'BAT-A',
              collateral: '1 BAT',
              daiDebt: '1.00 DAI',
              shutdownValue: '$40.00',
              exchangeRate: '1 DAI : 0.0250 BAT',
              vaultValue: '0.08 BAT' },
            {
            collateral: '1 ETH',
            daiDebt: '1.00 DAI',
            exchangeRate: '1 DAI : 0.0005 ETH',
            id: ilks.findIndex(i => i[0]==='ETH-A')+1,
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
  await withdraw(ilks[3]);
  await withdraw(ilks[4]);
  await withdraw(ilks[5]);
  expect.assertions(ilks.length);
});

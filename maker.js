import Maker from '@makerdao/dai';
import mcdPlugin, { MDAI, BAT } from '@makerdao/dai-plugin-mcd';
// import migrationPlugin from '@makerdao/dai-plugin-migrations';
import migrationPlugin from './plugin/src/index';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import walletLinkPlugin from '@makerdao/dai-plugin-walletlink';
import walletConnectPlugin from '@makerdao/dai-plugin-walletconnect';
import { checkEthereumProvider } from './utils/ethereum';
import { createCurrency } from '@makerdao/currency';
import assert from 'assert';
import ilkList from './references/ilkList';

export const SAI = createCurrency('SAI');
export const PETH = Maker.PETH;
export const ETH = Maker.ETH;
export const USD = Maker.USD;
export const DAI = MDAI;

let maker;

export function getMaker() {
  assert(maker, 'Maker has not been instantiated');
  return maker;
}

const INFURA_KEY = '6ba7a95268bf4ccda9bf1373fe582b43';

const scdESTestAddressOverrides = {
  SAI_GEM: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  SAI_GOV: '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD',
  SAI_PIP: '0xd65e5e0A6F601d41221eB6Fd3AFA85854EdCa2F9',
  SAI_PEP: '0x2c2ceD47D68dfe54920a920c94B941F793aD6793',
  SAI_PIT: '0xbd747742B0F1f9791d3e6B85f8797A0cf4fbf10b',
  SAI_SAI: '0xEf0a998a09E7AC683bD5b5c35721646456C6b284',
  SAI_SIN: '0x67e805382683397124bAC22512E98a337fA2a732',
  SAI_SKR: '0xb20a1f576055D05eFDA1dFAdc3d18999A49Efb3E',
  SAI_DAD: '0xD60Ff198F1F89f05A434f64633970212f4f3800A',
  SAI_MOM: '0x0aB8960161E03561938A8C861EA2A22b5f340d9B',
  SAI_VOX: '0x5f3D74DAa9De09d512AC6D8D3F9f0B22974921f0',
  SAI_TUB: '0x81c3dD4873Fb724D1bc6b562d3fe573Eeb5b9f64',
  SAI_TAP: '0x97dED9E2F2D645b01b86FEc718b01cc5ecF4B476',
  SAI_TOP: '0x50b7A3217Ff1dB43e4cacfd7F3c099ec301B61CA',
  SAI_ADM: '0xdE6058CeBF6C5C2FE7aD791df862Ff683Cf3D7e9'
};

export async function instantiateMaker(network) {
  const url =
    network === 'test' || network === 'testnet'
      ? 'http://localhost:2000'
      : `https://${network}.infura.io/v3/${INFURA_KEY}`;

  // this is required here instead of being imported normally because it runs
  // code that will break if run server-side
  const trezorPlugin = require('@makerdao/dai-plugin-trezor-web').default;

  const mcdPluginConfig = {
    cdpTypes: [
      { currency: SAI, ilk: 'SAI' },
      ...ilkList.map(i => {
        return {
          currency: i.currency,
          ilk: i.key
        };
      })
    ]
  };

  const migrationPluginConfig = {};
  
  let daiAddressOverrides = {};

  if (network === 'kovan'  && global.mcdESTest) {
    const addresses = require('./addresses-kovan-mcd-es.json');
    mcdPluginConfig.addressOverrides = addresses;
    migrationPluginConfig.addressOverrides = addresses;
    daiAddressOverrides = {...addresses,
      CDP_MANAGER: addresses.CDP_MANAGER_1,
      MCD_VAT: addresses.MCD_VAT_1,
      MCD_END: addresses.MCD_END_1,
      GET_CDPS_1: addresses.GET_CDPS_1
    };
  }

  if (network === 'testnet') {
    const addresses = require('./addresses-testnet.json');
    mcdPluginConfig.addressOverrides = addresses;
    migrationPluginConfig.addressOverrides = addresses;
    daiAddressOverrides = {...addresses,
      CDP_MANAGER: addresses.CDP_MANAGER_1,
      MCD_VAT: addresses.MCD_VAT_1,
      MCD_END: addresses.MCD_END_1,
      GET_CDPS_1: addresses.GET_CDPS_1
    };
  }

  const config = {
    url,
    log: false,
    multicall: true,
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      walletLinkPlugin,
      walletConnectPlugin,
      [mcdPlugin, mcdPluginConfig],
      [migrationPlugin, migrationPluginConfig]
    ],
    smartContract: {
      addressOverrides: {
        ...daiAddressOverrides,
        MAKER_OTC: {
          mainnet: '0x794e6e91555438afc3ccf1c5076a74f42133d08d',
          kovan: '0xe325acb9765b02b8b418199bf9650972299235f4'
        }
      }
    },
    token: { addressOverrides: {} }
  };

  if (global.scdESTest && !global.testnet) {
    console.log('using custom SCD deployment');
    Object.assign(config.token.addressOverrides, {
      PETH: scdESTestAddressOverrides.SAI_SKR,
      DAI: scdESTestAddressOverrides.SAI_SAI
    });
    Object.assign(
      config.smartContract.addressOverrides,
      scdESTestAddressOverrides
    );
  }

  maker = await Maker.create('http', config);
  window.maker = maker; // for debugging
  return maker;
}

export async function connectBrowserProvider(maker) {
  const networkId = maker.service('web3').networkId();
  const browserProvider = await checkEthereumProvider();

  assert(
    browserProvider.networkId === networkId,
    `Expected network ID ${networkId}, got ${browserProvider.networkId}.`
  );
  assert(
    browserProvider.address &&
      browserProvider.address.match(/^0x[a-fA-F0-9]{40}$/),
    'Got an incorrect or nonexistent wallet address.'
  );

  const getMatchedAccount = address =>
    maker
      .listAccounts()
      .find(acc => acc.address.toUpperCase() === address.toUpperCase());

  let account;
  if (maker.service('accounts').hasAccount()) {
    const matchedAccount = getMatchedAccount(browserProvider.address);
    if (!matchedAccount) {
      account = await maker.addAccount({ type: 'browser', autoSwitch: true });
    } else {
      account = matchedAccount;
    }
  } else {
    account = await maker.addAccount({ type: 'browser', autoSwitch: true });
  }

  maker.useAccountWithAddress(account.address);
  return maker.currentAddress();
}

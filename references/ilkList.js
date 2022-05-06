/*
can get the list of active ilks from the ilk registry: https://etherscan.io/address/0x5a464c28d19848f44199d003bef5ecc87d090f87#readContract
use the list function to get an ilk's bytes32 representation, then pass it into the ilkData function to see what ilk it is
problem is it includes ilks that have been offboarded, can check daistats to see if its been offboarded
*/
import {
  ETH,
  BAT,
  USDC,
  WBTC,
  TUSD,
  ZRX,
  KNC,
  MANA,
  USDT,
  PAXUSD,
  COMP,
  LRC,
  LINK,
  YFI,
  BAL,
  GUSD,
  UNI,
  RENBTC,
  AAVE,
  MATIC,
  WSTETH,
  UNIV2DAIETH
} from '@makerdao/dai-plugin-mcd';

export default [
  {
    symbol: 'ETH-A', // how it's displayed in the UI
    key: 'ETH-A', // the actual ilk name used in the vat
    gem: 'ETH', // the actual asset that's being locked
    currency: ETH, // the associated dai.js currency type
  },
  {
    symbol: 'ETH-B',
    key: 'ETH-B',
    gem: 'ETH',
    currency: ETH,
  },
  {
    symbol: 'ETH-C',
    key: 'ETH-C',
    gem: 'ETH',
    currency: ETH,
  },
  {
    symbol: 'USDC-A',
    key: 'USDC-A',
    gem: 'USDC',
    currency: USDC,
    decimals: 6
  },
  {
    symbol: 'WBTC-A',
    key: 'WBTC-A',
    gem: 'WBTC',
    currency: WBTC,
    decimals: 8
  },
  {
    symbol: 'MANA-A',
    key: 'MANA-A',
    gem: 'MANA',
    currency: MANA,
  },
  {
    symbol: 'PAXUSD-A',
    key: 'PAXUSD-A',
    gem: 'PAXUSD',
    currency: PAXUSD,
  },
  {
    symbol: 'COMP-A',
    key: 'COMP-A',
    gem: 'COMP',
    currency: COMP,
  },
  {
    symbol: 'LINK-A',
    key: 'LINK-A',
    gem: 'LINK',
    currency: LINK,
  },
  {
    symbol: 'YFI-A',
    key: 'YFI-A',
    gem: 'YFI',
    currency: YFI,
  },
  {
    symbol: 'GUSD-A',
    key: 'GUSD-A',
    gem: 'GUSD',
    currency: GUSD,
    decimals: 2
  },
  {
    symbol: 'UNI-A',
    key: 'UNI-A',
    gem: 'UNI',
    currency: UNI,
  },
  {
    symbol: 'RENBTC-A',
    key: 'RENBTC-A',
    gem: 'RENBTC',
    currency: RENBTC,
    decimals: 8
  },
  {
    symbol: 'UNIV2DAIETH-A',
    key: 'UNIV2DAIETH-A',
    gem: 'UNIV2DAIETH',
    currency: UNIV2DAIETH,
  },
  {
    symbol: 'UNIV2WBTCETH-A',
    key: 'UNIV2WBTCETH-A',
    gem: 'UNIV2WBTCETH',
    currency: UNIV2WBTCETH
  },
  {
    symbol: 'UNIV2USDCETH-A',
    key: 'UNIV2USDCETH-A',
    gem: 'UNIV2USDCETH',
    currency: UNIV2USDCETH
  },
  {
    symbol: 'UNIV2DAIUSDC-A',
    key: 'UNIV2DAIUSDC-A',
    gem: 'UNIV2DAIUSDC',
    currency: UNIV2DAIUSDC
  },
  {
    symbol: 'UNIV2UNIETH-A',
    key: 'UNIV2UNIETH-A',
    gem: 'UNIV2UNIETH',
    currency: UNIV2UNIETH
  },
  {
    symbol: 'UNIV2WBTCDAI-A',
    key: 'UNIV2WBTCDAI-A',
    gem: 'UNIV2WBTCDAI',
    currency: UNIV2WBTCDAI
  },
  {
    symbol: 'PSM-USDC-A',
    key: 'PSM-USDC-A',
    gem: 'USDC',
    currency: USDC,
  },
  {
    symbol: 'RWA001-A',
    key: 'RWA001-A',
    gem: 'RWA001',
    currency: RWA001,
  },
  {
    symbol: 'RWA002-A',
    key: 'RWA002-A',
    gem: 'RWA002',
    currency: RWA002,
  },
  {
    symbol: 'RWA003-A',
    key: 'RWA003-A',
    gem: 'RWA003',
    currency: RWA003,
  },
  {
    symbol: 'RWA004-A',
    key: 'RWA004-A',
    gem: 'RWA004',
    currency: RWA004,
  },
  {
    symbol: 'RWA005-A',
    key: 'RWA005-A',
    gem: 'RWA005',
    currency: RWA005,
  },
  {
    symbol: 'PSM-PAX-A',
    key: 'PSM-PAX-A',
    gem: 'PAX',
    currency: PAX,
  },
  {
    symbol: 'MATIC-A',
    key: 'MATIC-A',
    gem: 'MATIC',
    currency: MATIC,
  },
  {
    symbol: 'GUNIV3DAIUSDC1-A',
    key: 'GUNIV3DAIUSDC1-A',
    gem: 'GUNIV3DAIUSDC1',
    currency: GUNIV3DAIUSDC1,
  },
  {
    symbol: 'WSTETH-A',
    key: 'WSTETH-A',
    gem: 'WSTETH',
    currency: WSTETH,
  },
  {
    symbol: 'DIRECT-AAVEV2-DAI',
    key: 'DIRECT-AAVEV2-DAI',
    gem: 'ADAI',
    currency: ADAI,
  },
  {
    symbol: 'WBTC-B',
    key: 'WBTC-B',
    gem: 'WBTC',
    currency: WBTC,
  },
  {
    symbol: 'WBTC-C',
    key: 'WBTC-C',
    gem: 'WBTC',
    currency: WBTC,
  },
  {
    symbol: 'PSM-GUSD-A',
    key: 'PSM-GUSD-A',
    gem: 'GUSD',
    currency: GUSD,
  },
  {
    symbol: 'GUNIV3DAIUSDC2-A',
    key: 'GUNIV3DAIUSDC2-A',
    gem: 'GUNIV3DAIUSDC2',
    currency: GUNIV3DAIUSDC2,
  },
  {
    symbol: 'CRVV1ETHSTETH-A',
    key: 'CRVV1ETHSTETH-A',
    gem: 'CRVV1ETHSTETH',
    currency: CRVV1ETHSTETH,
  }
];
/*
This file is basically copied from https://github.com/makerdao/mcd-cdp-portal/blob/master/src/references/ilkList.js
the slug and network properties are not used in this project
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
    symbol: 'BAT-A',
    key: 'BAT-A',
    gem: 'BAT',
    currency: BAT,
  },
  {
    symbol: 'USDC-A',
    key: 'USDC-A',
    gem: 'USDC',
    currency: USDC,
    decimals: 6
  },
  {
    symbol: 'USDC-B',
    key: 'USDC-B',
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
    symbol: 'TUSD-A',
    key: 'TUSD-A',
    gem: 'TUSD',
    currency: TUSD,
  },
  {
    symbol: 'KNC-A',
    key: 'KNC-A',
    gem: 'KNC',
    currency: KNC,
  },
  {
    symbol: 'ZRX-A',
    key: 'ZRX-A',
    gem: 'ZRX',
    currency: ZRX,
  },
  {
    symbol: 'MANA-A',
    key: 'MANA-A',
    gem: 'MANA',
    currency: MANA,
  },
  {
    symbol: 'USDT-A',
    key: 'USDT-A',
    gem: 'USDT',
    currency: USDT,
    decimals: 6
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
    symbol: 'LRC-A',
    key: 'LRC-A',
    gem: 'LRC',
    currency: LRC,
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
    symbol: 'BAL-A',
    key: 'BAL-A',
    gem: 'BAL',
    currency: BAL,
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
    symbol: 'AAVE-A',
    key: 'AAVE-A',
    gem: 'AAVE',
    currency: AAVE,
  },
  {
    symbol: 'PSM-USDC-A',
    key: 'PSM-USDC-A',
    gem: 'USDC',
    currency: USDC,
  },
  // {
  //   symbol: 'MATIC-A',
  //   key: 'MATIC-A',
  //   gem: 'MATIC',
  //   currency: MATIC,
  // },
  // {
  //   symbol: 'WSTETH-A',
  //   key: 'WSTETH-A',
  //   gem: 'WSTETH',
  //   currency: WSTETH,
  // },
  // {
  //   slug: 'univ2daieth-a',
  //   symbol: 'UNIV2DAIETH-A',
  //   key: 'UNIV2DAIETH-A',
  //   gem: 'UNIV2DAIETH',
  //   currency: UNIV2DAIETH,
  //   networks: ['mainnet', 'kovan']
  // },
];
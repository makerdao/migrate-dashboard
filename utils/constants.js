import BigNumber from 'bignumber.js';

export const MAX_UINT_HEX = `0x${Array(64 + 1).join('f')}`;
export const MAX_UINT_BN = BigNumber(MAX_UINT_HEX).shiftedBy(-18);

export const AccountTypes = {
  LEDGER: 'ledger',
  TREZOR: 'trezor',
  METAMASK: 'browser'
};

export const OASIS_HOSTNAME = 'https://staging.oasis.app';

export const CDP_MIGRATION_MINIMUM_DEBT = 20;

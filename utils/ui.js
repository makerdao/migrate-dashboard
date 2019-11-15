import { isValidTxString, isValidAddressString } from './ethereum';

export function cutMiddle(str = '', left = 4, right = 4) {
  if (str.length <= left + right) return str;
  return `${str.slice(0, left)}...${str.slice(-right)}`;
}

export const copyToClipboard = string => {
  const textArea = document.createElement('textarea');
  textArea.value = string;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('Copy');
  textArea.remove();
};

export function prettifyFloat(num, decimalPlaces = 2) {
  if (!num && num !== 0) return 'NaN';
  const [, decimalPortion] = num.toString().split('.');
  const decimalPlacesInNumber = decimalPortion ? decimalPortion.length : 0;

  return decimalPlacesInNumber > decimalPlaces
    ? `${num.toFixed(decimalPlaces)}...`
    : num;
}

export function cleanSymbol(s) {
  if (s === 'MDAI') return 'DAI';
  if (s === 'DAI') return 'SAI';
  return s;
}

export function prettifyNumber(
  _num = null,
  truncate = false,
  decimalPlaces = 2,
  keepSymbol = true
) {
  if (_num === null) return null;
  let symbol = ' ';
  if (_num.symbol !== undefined) symbol += cleanSymbol(_num.symbol);
  const num = parseFloat(_num.toString());
  if (num > Number.MAX_SAFE_INTEGER) return 'NUMBER TOO BIG';
  let formattedNumber;
  if (truncate) {
    if (num > 999999) formattedNumber = (num / 1000000).toFixed(1) + ' M';
    else if (num > 999) formattedNumber = (num / 1000).toFixed(1) + ' K';
    else formattedNumber = num.toFixed(decimalPlaces);
  } else {
    formattedNumber = num.toLocaleString(undefined, {
      maximumFractionDigits: decimalPlaces
    });
  }
  return keepSymbol ? formattedNumber + symbol : formattedNumber;
}

export const etherscanLink = (string, network = 'mainnet') => {
  const pathPrefix = network === 'mainnet' ? '' : `${network}.`;
  if (isValidAddressString(string))
    return `https://${pathPrefix}etherscan.io/address/${string}`;
  else if (isValidTxString(string))
    return `https://${pathPrefix}etherscan.io/tx/${string}`;
  else throw new Error(`Can't create Etherscan link for "${string}"`);
};

export const oasisLink = (string, network) => {
  return `http://${network === 'kovan' ? 'staging.' : ''}oasis.app${string}`;
};

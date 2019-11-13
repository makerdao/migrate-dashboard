export const parseError = error => {
  if (typeof error === 'string') {
    return cleanErrorMsg(error);
  } else if (typeof error.message === 'string') {
    return cleanErrorMsg(error.message);
  }
};

export const cleanErrorMsg = errorMsg => {
  if (errorMsg.search('Error: ') === 0) {
    if (errorMsg.search('Transaction gas is too low') > -1)
      return 'Transaction gas is too low';
    return errorMsg.replace('Error: ', '');
  }
  if (
    errorMsg.search('Insufficient funds') > -1 ||
    errorMsg.search('insufficient funds') > -1
  )
    return 'The account you tried to send a transaction from does not have enough ETH to pay for gas';
  if (errorMsg.search('transport') > -1) return 'Ledger connect failed';
  if (errorMsg.search('Ledger') > -1 && errorMsg.search('0x6a80') > -1) {
    return (errorMsg += ' (is contract data enabled on your device?)');
  }
  return errorMsg;
};

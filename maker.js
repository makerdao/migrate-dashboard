import Maker from '@makerdao/dai';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({ rpcUrl, network }) {
  const trezorPlugin = require('@makerdao/dai-plugin-trezor-web').default;

  const config = {
    log: false,
    plugins: [trezorPlugin, ledgerPlugin],
    smartContract: {
      addContracts: {}
    },
    provider: {
      url: rpcUrl,
      type: 'HTTP'
    }
  };

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

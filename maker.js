import Maker from '@makerdao/dai';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({
  rpcUrl,
  network
}) {

  const config = {
    log: false,
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
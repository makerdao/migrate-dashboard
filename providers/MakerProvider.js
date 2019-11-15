import React, { createContext, useState, useEffect } from 'react';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

const config = {
  kovan: {
    rpcUrl: 'https://kovan.infura.io/v3/58073b4a32df4105906c702f167b91d2'
  },
  mainnet: {
    rpcUrl: 'https://mainnet.infura.io/v3/e12561901a29439caf50a1c41259f675'
  }
};

function MakerProvider({ children, network }) {
  const [account, setAccount] = useState(null);
  const [maker, setMaker] = useState(null);

  useEffect(() => {
    if (!network) return;
    const { rpcUrl } = config[network];
    instantiateMaker({ network, rpcUrl }).then(maker => {
      setMaker(maker);
      if (maker.service('accounts').hasAccount())
        setAccount(maker.currentAccount());

      maker.on('accounts/CHANGE', eventObj => {
        const { account } = eventObj.payload;
        setAccount(account);
      });
    });
  }, [network]);

  return (
    <MakerObjectContext.Provider value={{ maker, account, network }}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerProvider;

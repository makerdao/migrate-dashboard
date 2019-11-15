import React, { createContext, useState, useEffect } from 'react';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

const INFURA_KEY = '6ba7a95268bf4ccda9bf1373fe582b43';

function MakerProvider({ children, network }) {
  const [account, setAccount] = useState(null);
  const [maker, setMaker] = useState(null);

  useEffect(() => {
    if (!network) return;
    const rpcUrl = `https://${network}.infura.io/v3/${INFURA_KEY}`;
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

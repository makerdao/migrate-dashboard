import React, { createContext, useState, useEffect } from 'react';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

function MakerProvider({ children, network }) {
  const [account, setAccount] = useState(null);
  const [maker, setMaker] = useState(null);

  useEffect(() => {
    if (!network) return;
    instantiateMaker(network).then(maker => {
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

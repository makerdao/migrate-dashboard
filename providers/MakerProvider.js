import React, { createContext, useState, useEffect } from 'react';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

function MakerProvider({ children, rpcUrl, network }) {
  const [account, setAccount] = useState(null);
  const [maker, setMaker] = useState(null);
  const initAccount = account => setAccount({ ...account });

  useEffect(
    () => {
      if (!rpcUrl) return;
      instantiateMaker({ network, rpcUrl }).then(maker => {
        setMaker(maker);
        if (maker.service('accounts').hasAccount())
          initAccount(maker.currentAccount());

        maker.on('accounts/CHANGE', eventObj => {
          const { account } = eventObj.payload;
          initAccount(account);
        });
      });
    },
    [rpcUrl]
  );
  return (
    <MakerObjectContext.Provider value={{ maker, account, network }}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerProvider;

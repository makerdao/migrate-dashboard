import { useState, useEffect } from 'react';
import useMaker from './useMaker';

//TODO: rewrite to just use dai.js instead of multicall
const useBlockHeight = (initialState = null) => {
  const { maker } = useMaker();
  const [blockHeight, setblockHeight] = useState(initialState);

  useEffect(() => {
    if (maker && maker.service('multicall').watcher) {
      console.log('maker && maker.service(\'multicall\').watcher');
      const subscription = maker
        .service('multicall')
        .watcher.onNewBlock(blockHeight => setblockHeight(blockHeight));
      return subscription.unsub;
    }
  }, [maker]);

  return blockHeight;
};

export default useBlockHeight;

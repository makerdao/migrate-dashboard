import { useState, useEffect } from 'react';
import useMaker from './useMaker';

const useBlockHeight = (initialState = null) => {
  const { maker } = useMaker();
  const [blockHeight, setblockHeight] = useState(initialState);

  useEffect(() => {
    if (maker) {
      maker.service('web3').onNewBlock(blockHeight => {
        setblockHeight(blockHeight);
      });
    }
  }, [maker]);

  return blockHeight;
};

export default useBlockHeight;
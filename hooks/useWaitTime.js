import { useEffect, useState } from 'react';

const useWaitTime = maker => {
  const [waitTime, setWaitTime] = useState();

  useEffect(() => {
    (async () => {
      // this is the default transaction speed
      const waitTime = await maker.service('gas').getWaitTime('fast');
      const minutes = Math.round(waitTime);
      const seconds = Math.round(waitTime * 6) * 10;

      const waitTimeText =
        waitTime < 1
          ? `${seconds} seconds`
          : `${minutes} minute${minutes === 1 ? '' : 's'}`;

      setWaitTime(waitTimeText);
    })();
  }, [maker]);

  return waitTime;
};

export default useWaitTime;

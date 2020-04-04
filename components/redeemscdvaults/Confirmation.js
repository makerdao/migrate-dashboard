import React, { useEffect, useState } from 'react';
import { Text, Button, Grid, Card } from '@makerdao/ui-components-core';
import { TOSCheck } from '../migratecdp/PayAndMigrate';
import { ETH } from '@makerdao/dai';
import useMaker from '../../hooks/useMaker';
import sortBy from 'lodash/sortBy';

export default ({ onPrev, onNext, selectedCdps, pethInVaults, ratio }) => {
  const [hasReadTOS, setHasReadTOS] = useState();
  const [cdpInstances, setCdpInstances] = useState();
  const [nonProxyNum, setNonProxyNum] = useState();
  const { maker } = useMaker();
  const saiTubContractAddress = maker
    .service('smartContract')
    .getContract('SAI_TUB').address;

  useEffect(() => {
    const cs = maker.service('cdp');
    (async () => {
      const getCdps = selectedCdps.map(id => cs.getCdp(id));
      const cdps = await Promise.all(getCdps);
      setCdpInstances(cdps);
      setNonProxyNum(cdps.filter(c => !c.dsProxyAddress).length);
    })();
  }, [maker, selectedCdps]);

  const needExitTx = nonProxyNum > 0;
  const needWithdrawTx = nonProxyNum === selectedCdps.length;
  const txCount = selectedCdps.length + (needWithdrawTx > 0 ? 2 : 0);

  const redeemCdps = async () => {
    // TODO update state for in-progress screen
    onNext();

    for (const cdp of cdpInstances.filter(c => !c.dsProxyAddress)) {
      const val = pethInVaults.find(x => x[0] === cdp.id)[1];
      console.log(`freeing ${val.toString(4)} for cdp ${cdp.id}`);
      await cdp.freeEth(val);
    }

    // PETH exit has to happen before proxy cdp freeing, because it withdraws all WETH
    if (needExitTx) {
      const peth = maker.getToken('PETH');
      const balance = await peth.balance();
      console.log(`exiting ${balance.toString(4)}`);
      await peth.approveUnlimited(saiTubContractAddress);
      await peth.exit(balance);
    }

    // eslint-disable-next-line require-atomic-updates
    for (const cdp of cdpInstances.filter(c => c.dsProxyAddress)) {
      const pethVal = pethInVaults.find(x => x[0] === cdp.id)[1];
      const ethVal = ETH(pethVal.times(ratio));
      
      console.log(
        pethVal.toFixed('wei'),
        ratio.toString(),
        ethVal.toFixed('wei')
      );

      console.log(`freeing ${ethVal.toString(4)} for cdp ${cdp.id}`);
      await cdp.freeEth(ethVal);
    }

    if (needWithdrawTx) {
      const weth = maker.getToken('WETH');
      const balance = await weth.balance();
      console.log(`withdrawing ${balance.toString(4)}`);
      await weth.withdraw(balance);
    }
  };

  return (
    <Grid maxWidth="600px" gridRowGap="m" px={['s', 0]} minWidth="38rem">
      <Text.h2 textAlign="center" m="s">
        Confirm Transaction
      </Text.h2>
      <Card px="l" py="m">
        <Grid gridTemplateColumns="1fr 1fr 1fr" pb="s" gridColumnGap="m">
          <Text t="subheading">CDP ID</Text>
          <Text t="subheading">PETH Value</Text>
          <Text t="subheading">ETH Value</Text>
        </Grid>
        {selectedCdps.map((id, index) => (
          <Row
            key={id}
            amount={pethInVaults.find(x => x[0] === id)[1]}
            {...{ id, index, ratio }}
          />
        ))}
        <TOSCheck {...{ hasReadTOS, setHasReadTOS }} pt="m" />
      </Card>
      {txCount > 1 && (
        <Card bg="yellow.100" p="m" borderColor="yellow.400" border="1px solid">
          When you click Continue, you will be prompted to sign {txCount}{' '}
          transactions: one for each CDP
          {needExitTx && ', and one to convert PETH to WETH'}
          {needWithdrawTx && ', and one to convert WETH to ETH'}.
        </Card>
      )}
      <Grid
        justifySelf="center"
        justifyContent="center"
        gridTemplateColumns="auto auto"
        gridColumnGap="m"
      >
        <Button variant="secondary-outline" onClick={onPrev}>
          Back
        </Button>
        <Button disabled={!hasReadTOS} onClick={redeemCdps}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

const Row = ({ id, index, amount, ratio }) => (
  <Grid
    gridTemplateColumns="1fr 1fr 1fr"
    key={id}
    gridColumnGap="m"
    py="m"
    borderTop={index === 0 ? 'none' : '1px solid #e9e9e9'}
  >
    <span>#{id}</span>
    <span>{amount.toString(3)}</span>
    <span>{ETH(amount.times(ratio)).toString(3)}</span>
  </Grid>
);

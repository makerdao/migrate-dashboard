#!/usr/bin/env bash
set -e

# TODO take the source directory as a parameter

CWD=`dirname $0`
CONTRACTS=$CWD/../contracts
SOURCE=${1:-$CWD/../../node_modules/@makerdao/testchain}

# Relevant contracts from SCD:
for CONTRACT in "TUB","SaiTub" "REDEEMER","Redeemer" "OLD_MKR","DSToken" "OLD_CHIEF","DSChief" "SAI_CAGEFREE","CageFree" "OLD_VOTE_PROXY_FACTORY","VoteProxyFactory"
do
  IFS=',' read NAME ABI <<< "${CONTRACT}"
  ADDRESS=`jq ".$NAME" "$SOURCE/out/addresses.json"`
  jq ".$NAME=$ADDRESS" $CONTRACTS/addresses/testnet.json > testnet.tmp && mv testnet.tmp $CONTRACTS/addresses/testnet.json
  cp $SOURCE/out/$ABI.abi $CONTRACTS/abis/$ABI.json
done

# Relevant contracts from MCD:
for CONTRACT in "MCD_JOIN_ETH_A","GemJoin" "MCD_JOIN_DAI","DaiJoin" "MCD_JOIN_BAT_A","GemJoin" "MIGRATION","ScdMcdMigration" "MIGRATION_PROXY_ACTIONS","MigrationProxyActions" "PROXY_ACTIONS_END","DssProxyActionsEnd" "MCD_JOIN_USDC_A","GemJoin" "MCD_ESM","ESM"
do
  IFS=',' read NAME ABI <<< "${CONTRACT}"
  ADDRESS=`jq ".$NAME" "$SOURCE/out/addresses-mcd.json"`
  jq ".$NAME=$ADDRESS" $CONTRACTS/addresses/testnet.json > testnet.tmp && mv testnet.tmp $CONTRACTS/addresses/testnet.json
  cp $SOURCE/out/mcd/$ABI.abi $CONTRACTS/abis/$ABI.json
done

# Contracts (from MCD) with numbered versions:
for CONTRACT in "MCD_END","END" "MCD_VAT","VAT" "GET_CDPS","GetCdps" "CDP_MANAGER","DssCdpManager" "MCD_DAI","Dai" "MCD_POT","Pot"
do
  IFS=',' read NAME ABI <<< "${CONTRACT}"
  ADDRESS=`jq ".$NAME" "$SOURCE/out/addresses-mcd.json"`
  SUFFIX="_1"
  jq ".$NAME$SUFFIX=$ADDRESS" $CONTRACTS/addresses/testnet.json > testnet.tmp && mv testnet.tmp $CONTRACTS/addresses/testnet.json
  cp $SOURCE/out/mcd/$ABI.abi $CONTRACTS/abis/$ABI.json
done

cp $CONTRACTS/addresses/testnet.json $CWD/../../addresses-testnet.json
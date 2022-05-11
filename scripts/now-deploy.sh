#!/usr/bin/env bash
set -e

NOW_EXEC=./node_modules/.bin/now
FROM_NAME=`$NOW_EXEC --token $NOW_TOKEN --scope dux-core-unit`
BRANCH=`echo ${CIRCLE_BRANCH//./-} | tr '[:upper:]' '[:lower:]'`
TO_NAME=migrate-dashboard-git-${BRANCH}.dux-core-unit.now.sh

$NOW_EXEC alias --token $NOW_TOKEN --scope dux-core-unit $FROM_NAME $TO_NAME

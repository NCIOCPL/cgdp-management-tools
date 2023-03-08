#!/bin/bash
#
# Minimal script to facilitate running the stage-to-lower script from CI.
#
if [[ -z $USERNAME || -z $ACSF_API_KEY || -z $FACTORY_HOST || -z $TARGET ]];
then
    echo 'The USERNAME, ACSF_API_KEY, FACTORY_HOST, and TARGET variables must be set.'
    exit 1
fi

FACTORY_CONNECTION="\"factoryConnection\": { \"username\": \"${USERNAME}\", \"apikey\": \"${ACSF_API_KEY}\", \"factoryHost\": \"${FACTORY_HOST}\" }"

# List of sites to stage.  Jenkins will provide this as a comma-separated list.
if [[ -z $SITE_FILTER_LIST ]];
then
    FILTER=""
else
    FILTER=", \"stageList\": \"$SITE_FILTER_LIST\""
fi

export NODE_CONFIG="{ $FACTORY_CONNECTION $FILTER }"

cd $(dirname $0)

npm ci
node index.js $TARGET

if [[ $? -eq 0 ]];
then
    echo 'Completed.'
    echo
    echo 'Please remember to login and run post-stage-dev.sh or post-stage-test.sh'
fi

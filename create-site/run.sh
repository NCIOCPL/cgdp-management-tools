#!/bin/bash
#
# Minimal script to facilitate running the script from CI.
#
if [[ -z $USERNAME || -z $ACSF_API_KEY || -z $FACTORY_HOST ]];
then
    echo 'The USERNAME, ACSF_API_KEY, and FACTORY_HOST variables must be set.'
    exit 1
fi

FACTORY_CONNECTION="\"factoryConnection\": { \"username\": \"${USERNAME}\", \"apikey\": \"${ACSF_API_KEY}\", \"factoryHost\": \"${FACTORY_HOST}\" }"

export NODE_CONFIG="{ $FACTORY_CONNECTION }"

cd $(dirname $0)

npm ci
node index.js $@


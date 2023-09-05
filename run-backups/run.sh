#!/bin/bash
#

cd $(dirname $0)

# Shim to make nvm work when run via crontab. The gist of it is that nvm needs to modify
# the current shell's environment variables, and that doesn't happen when running
# under crontab.
# based on https://gist.github.com/simov/cdbebe2d65644279db1323042fcf7624
export NVM_DIR="${HOME}/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

nvm use

node index.js

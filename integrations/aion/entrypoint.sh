#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

cmd="$@"

if [ "${POCKET_NODE_PLUGIN_AION:-enabled}" = "enabled" ]; then

  cat <<EOF > ${POCKET_NODE_CONFIGURATION_DIR}/aion.json
{
  "${POCKET_NODE_PLUGIN_AION_MAIN_NETWORK_ID:-256}": {
    "aion_node": "${POCKET_NODE_PLUGIN_AION_MAIN_NODE:-http://aion-mainnet:8545}",
    "network_id": "${POCKET_NODE_PLUGIN_AION_MAIN_NETWORK_ID:-256}"
  },
  "${POCKET_NODE_PLUGIN_AION_TEST_NETWORK_ID:-32}": {
    "aion_node": "${POCKET_NODE_PLUGIN_AION_TESTNET_NODE:-http://aion-mastery:8545}",
    "network_id": "${POCKET_NODE_PLUGIN_AION_TEST_NETWORK_ID:-32}"
  }

}

EOF
  pocket-node configure AION ${POCKET_NODE_CONFIGURATION_DIR}/aion.json
fi


exec $cmd

#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

cmd="$@"

if [ "${POCKET_NODE_PLUGIN_ETH:-enabled}" = "enabled" ]; then

  cat <<EOF > ${POCKET_NODE_CONFIGURATION_DIR}/eth.json
{
  "${POCKET_NODE_PLUGIN_ETH_NETWORK_ID:-4}": {
    "eth_node": "${POCKET_NODE_PLUGIN_ETH_NODE_URL:-http://geth:8545}",
    "eth_network_id": "${POCKET_NODE_PLUGIN_ETH_NETWORK_ID:-4}"
  }
}

EOF
  pocket-node configure ETH ${POCKET_NODE_CONFIGURATION_DIR}/eth.json
fi


exec $cmd

#!/bin/bash
# if POCKET_NODE_PLUGIN_ETH is empty or "enabled", configure the eth plugin
if [ "${POCKET_NODE_PLUGIN_ETH:-enabled}" = "enabled" ]; then

  cat <<EOF > ${POCKET_NODE_CONFIGURATION_DIR}/eth.json
{
  "eth_node": "${POCKET_NODE_PLUGIN_ETH_NODE:-http://localhost:8545}",
  "eth_network_id": "${POCKET_NODE_PLUGIN_ETH_NETWORK_ID:-5777}"
}
EOF

  pocket-node configure ETH ${POCKET_NODE_CONFIGURATION_DIR}/eth.json
fi

# Execute the pocket-node with the desired port
exec pocket-node start -p ${POCKET_NODE_SERVER_PORT:-8000} -o /dev/stdout

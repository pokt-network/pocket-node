#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

if [ "${POCKET_NODE_PLUGIN_AION:-enabled}" = "enabled" ]; then
  pocket-node install pnp-aion

fi

if [ "${POCKET_NODE_PLUGIN_ETH:-enabled}" = "enabled" ]; then
  pocket-node install pnp-eth
fi

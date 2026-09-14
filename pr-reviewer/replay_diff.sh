#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

source ./run.sh

source_diff=${1}

pr_dir=output/replay-$$

mkdir ${pr_dir}

cp "${source_diff}" ${pr_dir}/pr.diff

trap _stop_proxy EXIT

_ensure_proxy

_write_model_json_file sonnet-4.6

echo "REPLAY_DIR=${pr_dir}"

cat ${pr_dir}/sonnet-4.6.json

#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

source ./run.sh

head_ref=${1:-HEAD}

base_commit=$(git merge-base ${_BASE_BRANCH} ${head_ref})

pr_dir=output/local-$(git rev-parse --short ${head_ref})-$$

mkdir --parents ${pr_dir}

rm --force ${pr_dir}/*

trap _stop_proxy EXIT

_ensure_proxy

_run_review "${base_commit}..${head_ref}" "${head_ref}"

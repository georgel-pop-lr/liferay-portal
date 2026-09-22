#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

source ./run.sh

base_commit=${1}
head_ref=${2}

pr_dir=output/local-$(git rev-parse --short ${head_ref})-$$

mkdir --parents output

# The pid makes pr_dir fresh, so there is nothing to clean out of it. Never add
# a deletion of its contents back: the harness reads a removal whose path
# starts with a variable as one that could expand to the filesystem root, and
# that check cannot be auto-allowed by a permission rule, so it prompts on
# every single run of the skill that writes this file. Plain mkdir instead of
# --parents so a recycled pid fails the run under errexit rather than reading a
# stale run's output as this one's.
mkdir ${pr_dir}

trap _stop_proxy EXIT

_ensure_proxy

_run_review "${base_commit}..${head_ref}" "${head_ref}"

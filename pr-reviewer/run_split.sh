#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

source ./run.sh

function _add_commit_parts {
	local prefix=${1}

	local commit
	local count=0

	for commit in $(git rev-list --reverse ${base_commit}..${head_ref})
	do
		count=$((count + 1))

		local part_dir=${split_dir}/${prefix}${count}

		mkdir ${part_dir}

		_build_review_diff "${commit}^..${commit}" "${head_ref}" > ${part_dir}/pr.diff

		git log -1 --format="%h %s" ${commit} > ${part_dir}/commit.txt

		if [[ -s ${part_dir}/pr.diff ]]
		then
			part_dirs+=(${part_dir})
		fi
	done
}

function _review_part {
	local part_dir=${1}

	pr_dir=${part_dir}

	_write_model_json_file sonnet-4.6 2> ${part_dir}/stderr.log || true
}

function _wait_for_slot {
	while [[ $(jobs -r -p | wc -l) -ge ${_MAX_PARALLEL} ]]
	do
		wait -n || true
	done
}

if [[ ${#} -lt 3 ]]
then
	echo "Usage: run_split.sh <base> <head> <whole|file|commit|full> [whole run count]"
	echo "Example: run_split.sh 921978e083138 bb27db40c3b2f file"

	exit 1
fi

base_commit=${1}
head_ref=${2}
mode=${3}
whole_count=${4:-1}

_MAX_PARALLEL=${_MAX_PARALLEL:-6}

split_dir=output/split-$(git rev-parse --short ${head_ref})-${mode}-$$

mkdir --parents output

mkdir ${split_dir}

_build_review_diff "${base_commit}..${head_ref}" "${head_ref}" > ${split_dir}/whole.diff

part_dirs=()

if [[ ${mode} == whole ]]
then
	for ((i = 1; i <= whole_count; i++))
	do
		mkdir ${split_dir}/${i}

		cp ${split_dir}/whole.diff ${split_dir}/${i}/pr.diff

		part_dirs+=(${split_dir}/${i})
	done
elif [[ ${mode} == file ]]
then
	awk -v split_dir="${split_dir}" '
		/^diff --git / {
			count++

			part_dir = split_dir "/" count

			system("mkdir " part_dir)

			file = part_dir "/pr.diff"
		}
		{
			print > file
		}
	' ${split_dir}/whole.diff

	for part_dir in $(ls --directory ${split_dir}/*/ | sort --version-sort)
	do
		part_dirs+=(${part_dir%/})
	done
elif [[ ${mode} == commit ]]
then
	_add_commit_parts ""
elif [[ ${mode} == full ]]
then
	mkdir ${split_dir}/whole

	cp ${split_dir}/whole.diff ${split_dir}/whole/pr.diff

	part_dirs+=(${split_dir}/whole)

	_add_commit_parts a

	_add_commit_parts b
else
	echo "Unknown mode ${mode}: use whole, file, commit, or full."

	exit 1
fi

trap _stop_proxy EXIT

_ensure_proxy

for part_dir in "${part_dirs[@]}"
do
	_wait_for_slot

	_review_part ${part_dir} &
done

wait

for part_dir in "${part_dirs[@]}"
do
	jq --arg part "${part_dir##*/}" '{part: $part, chance, seconds, input_tokens, output_tokens, failure_type, violations}' ${part_dir}/sonnet-4.6.json
done | jq --slurp '.' > ${split_dir}/summary.json

echo "SPLIT_DIR=${split_dir}"

jq --raw-output '.[] | [.part, .chance, (.violations | length), .seconds, (.failure_type // "")] | @tsv' ${split_dir}/summary.json
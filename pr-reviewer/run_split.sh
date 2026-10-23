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

	for commit in $(git -C ${_LIFERAY_PORTAL_DIR} rev-list --reverse ${base_commit}..${head_ref})
	do
		count=$((count + 1))

		local part_dir=${split_dir}/${prefix}${count}

		mkdir ${part_dir}

		_build_review_diff "${commit}^..${commit}" "${head_ref}" > ${part_dir}/pr.diff

		git -C ${_LIFERAY_PORTAL_DIR} log -1 --format="%h %s" ${commit} > ${part_dir}/commit.txt

		if [[ -s ${part_dir}/pr.diff ]]
		then
			part_dirs+=(${part_dir})
		fi
	done
}

function _get_part_label {
	local part_dir=${1}

	if [[ -s ${part_dir}/commit.txt ]]
	then
		cat ${part_dir}/commit.txt
	elif [[ $(grep --count "^diff --git " ${part_dir}/pr.diff) -eq 1 ]]
	then
		grep "^diff --git " ${part_dir}/pr.diff | awk '{print substr($4, 3)}'
	else
		echo "whole diff"
	fi
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

function _write_report {
	local split_dir=${1}

	local part_dir
	local report_name=${split_dir##*/}
	local summary_json=${split_dir}/summary.json

	report_name=${report_name#split-}

	if [[ ! ${report_name} =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}_ ]]
	then
		report_name=$(date --reference=${summary_json} +%Y-%m-%d_%H-%M-%S)-${report_name%-*}
	fi

	local cost=$(for raw in ${split_dir}/*/sonnet-4.6.raw; do jq --raw-output ".total_cost_usd // 0" ${raw} 2> /dev/null || echo 0; done | LC_ALL=C awk '{sum += $1} END {printf "%.2f", sum}')

	{
		echo "# Split review ${report_name}"
		echo
		echo "- Date: $(date --reference=${summary_json} "+%Y-%m-%d %H:%M:%S")"
		echo "- Range: \`$(git -C ${_LIFERAY_PORTAL_DIR} rev-parse --short ${base_commit})..$(git -C ${_LIFERAY_PORTAL_DIR} rev-parse --short ${head_ref})\`"
		echo "- Model: \`${_CLAUDE_MODEL}\`"
		echo "- Sessions: $(jq length ${summary_json}), failed: $(jq "[.[] | select(.failure_type != null)] | length" ${summary_json})"
		echo "- Cost: \$${cost}"
		echo "- Slowest session: $(jq "[.[].seconds // 0] | max" ${summary_json}) s"
		echo "- Findings: $(jq "[.[].violations | length] | add // 0" ${summary_json})"
		echo
		echo "## Commits"
		echo

		git -C ${_LIFERAY_PORTAL_DIR} log --reverse --format="- \`%h\` %s" ${base_commit}..${head_ref}

		echo
		echo "## Findings"

		for part_dir in $(jq --raw-output ".[].part" ${summary_json})
		do
			echo
			echo "### ${part_dir}: $(_get_part_label ${split_dir}/${part_dir})"
			echo
			echo "Chance $(jq --arg part "${part_dir}" --raw-output ".[] | select(.part == \$part) | .chance" ${summary_json}), $(jq --arg part "${part_dir}" --raw-output ".[] | select(.part == \$part) | .seconds" ${summary_json}) s."
			echo

			jq --arg part "${part_dir}" --raw-output ".[] | select(.part == \$part) | .violations[] | \"- \" + ." ${summary_json}
		done
	} > ${split_dir}/report.md

	mkdir --parents reports/${report_name}

	cp ${split_dir}/report.md ${summary_json} reports/${report_name}

	echo "REPORT_DIR=reports/${report_name}"
}

if [[ ${#} -lt 3 ]]
then
	echo "Usage: run_split.sh <base> <head> <whole|file|commit|full> [whole run count]"
	echo "       run_split.sh <base> <head> report <split dir>"
	echo "Example: run_split.sh 921978e083138 bb27db40c3b2f full"

	exit 1
fi

base_commit=${1}
head_ref=${2}
mode=${3}

if [[ ${mode} == report ]]
then
	_write_report ${4%/}

	exit 0
fi

whole_count=${4:-1}

_MAX_PARALLEL=${_MAX_PARALLEL:-6}

split_dir=output/split-$(date +%Y-%m-%d_%H-%M-%S)-$(git -C ${_LIFERAY_PORTAL_DIR} rev-parse --short ${head_ref})-${mode}

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
	echo "Unknown mode ${mode}: use whole, file, commit, full, or report."

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

_write_report ${split_dir}
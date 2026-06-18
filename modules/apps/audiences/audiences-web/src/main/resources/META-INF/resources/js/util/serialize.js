/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

let counter = 0;

export function nextRuleId() {
	counter += 1;

	return `rule-${counter}`;
}

export function serializeAudience({conjunction, rules}) {
	return JSON.stringify({
		conjunction,
		rules: rules.map(({attribute, operator, value}) => ({
			attribute,
			operator,
			value,
		})),
	});
}

export function parseAudience(json) {
	let audience = {};

	if (json) {
		try {
			audience = JSON.parse(json);
		}
		catch (error) {
			audience = {};
		}
	}

	const rules = (audience.rules || [])
		.filter((rule) => !rule.rules)
		.map((rule) => ({
			attribute: rule.attribute,
			id: nextRuleId(),
			operator: rule.operator,
			value: rule.value,
		}));

	return {
		conjunction: audience.conjunction || 'AND',
		rules,
	};
}

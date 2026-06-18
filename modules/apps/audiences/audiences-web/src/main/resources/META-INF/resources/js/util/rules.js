/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export function clampIndex(index, length) {
	return Math.max(0, Math.min(index, length));
}

export function insertRuleAt(rules, rule, index) {
	const nextRules = [...rules];

	nextRules.splice(clampIndex(index, rules.length), 0, rule);

	return nextRules;
}

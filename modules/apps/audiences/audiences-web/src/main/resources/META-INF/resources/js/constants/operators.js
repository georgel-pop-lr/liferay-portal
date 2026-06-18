/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const OPERATOR_LABELS = {
	eq: Liferay.Language.get('is'),
	gt: Liferay.Language.get('is-after'),
	gte: Liferay.Language.get('is-on-or-after'),
	includes: Liferay.Language.get('contains'),
	lt: Liferay.Language.get('is-before'),
	lte: Liferay.Language.get('is-on-or-before'),
	not_eq: Liferay.Language.get('is-not'),
	not_includes: Liferay.Language.get('does-not-contain'),
};

export function getOperatorLabel(operator) {
	return OPERATOR_LABELS[operator] || operator;
}

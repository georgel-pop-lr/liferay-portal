/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	clampIndex,
	insertRuleAt,
} from '../../../src/main/resources/META-INF/resources/js/util/rules';

const RULES = [{id: 'a'}, {id: 'b'}, {id: 'c'}];

describe('clampIndex', () => {
	it('keeps the index within the bounds', () => {
		expect(clampIndex(-2, 3)).toBe(0);
		expect(clampIndex(1, 3)).toBe(1);
		expect(clampIndex(9, 3)).toBe(3);
	});
});

describe('insertRuleAt', () => {
	it('inserts at the index, clamps out-of-range, and never mutates', () => {
		expect(
			insertRuleAt(RULES, {id: 'x'}, 0).map((rule) => rule.id)
		).toEqual(['x', 'a', 'b', 'c']);
		expect(
			insertRuleAt(RULES, {id: 'x'}, 2).map((rule) => rule.id)
		).toEqual(['a', 'b', 'x', 'c']);
		expect(
			insertRuleAt(RULES, {id: 'x'}, 3).map((rule) => rule.id)
		).toEqual(['a', 'b', 'c', 'x']);
		expect(
			insertRuleAt(RULES, {id: 'x'}, 99).map((rule) => rule.id)
		).toEqual(['a', 'b', 'c', 'x']);

		const result = insertRuleAt(RULES, {id: 'x'}, 1);

		expect(result).not.toBe(RULES);
		expect(RULES).toEqual([{id: 'a'}, {id: 'b'}, {id: 'c'}]);
	});
});

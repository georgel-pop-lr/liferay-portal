/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	parseAudience,
	serializeAudience,
} from '../../../src/main/resources/META-INF/resources/js/util/serialize';

describe('serializeAudience', () => {
	it('produces the schema with single-level leaf rules and no local id', () => {
		const json = serializeAudience({
			conjunction: 'AND',
			rules: [
				{
					attribute: 'browser_name',
					id: 'rule-1',
					operator: 'eq',
					value: 'Chrome',
				},
				{
					attribute: 'local_date',
					id: 'rule-2',
					operator: 'lt',
					value: '2026-01-01',
				},
			],
		});

		expect(JSON.parse(json)).toEqual({
			conjunction: 'AND',
			rules: [
				{attribute: 'browser_name', operator: 'eq', value: 'Chrome'},
				{attribute: 'local_date', operator: 'lt', value: '2026-01-01'},
			],
		});
		expect(json).not.toContain('rule-1');
		expect(json).not.toContain('rule-2');
	});
});

describe('parseAudience', () => {
	it('defaults blank input, hydrates leaf rules with ids, and drops nested groups', () => {
		expect(parseAudience('')).toEqual({conjunction: 'AND', rules: []});
		expect(parseAudience('not json')).toEqual({
			conjunction: 'AND',
			rules: [],
		});

		const hydrated = parseAudience(
			JSON.stringify({
				conjunction: 'OR',
				rules: [
					{
						attribute: 'hostname',
						operator: 'eq',
						value: 'liferay.com',
					},
				],
			})
		);

		expect(hydrated.conjunction).toBe('OR');
		expect(hydrated.rules).toHaveLength(1);
		expect(hydrated.rules[0]).toMatchObject({
			attribute: 'hostname',
			operator: 'eq',
			value: 'liferay.com',
		});
		expect(hydrated.rules[0].id).toBeTruthy();

		const flattened = parseAudience(
			JSON.stringify({
				conjunction: 'AND',
				id: 'audience-4',
				rules: [
					{attribute: 'url', operator: 'eq', value: '/'},
					{
						conjunction: 'OR',
						rules: [
							{
								attribute: 'language',
								operator: 'eq',
								value: 'en_US',
							},
						],
					},
				],
			})
		);

		expect(flattened.rules).toHaveLength(1);
		expect(flattened.rules[0].attribute).toBe('url');
	});
});

describe('serializeAudience and parseAudience', () => {
	it('round-trips an audience through serialize and parse', () => {
		const parsed = parseAudience(
			serializeAudience({
				conjunction: 'AND',
				rules: [
					{
						attribute: 'browser_name',
						id: 'rule-1',
						operator: 'eq',
						value: 'Chrome',
					},
				],
			})
		);

		expect(parsed.conjunction).toBe('AND');
		expect(parsed.rules).toHaveLength(1);
		expect(parsed.rules[0]).toMatchObject({
			attribute: 'browser_name',
			operator: 'eq',
			value: 'Chrome',
		});
	});
});

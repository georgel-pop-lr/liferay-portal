/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	DragAndDropContextProvider,
	ScreenReaderAnnouncerContextProvider,
} from '@liferay/layout-js-components-web';
import {cleanup, render, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import AttributesContext from '../../../src/main/resources/META-INF/resources/js/AttributesContext';
import RuleGroup from '../../../src/main/resources/META-INF/resources/js/components/RuleGroup';

const ATTRIBUTES = [
	{
		icon: 'desktop',
		key: 'browser_name',
		label: 'browser-name',
		operators: ['eq', 'includes', 'not_eq', 'not_includes'],
		options: null,
		type: 'string',
	},
	{
		icon: 'calendar',
		key: 'local_date',
		label: 'local-date',
		operators: ['eq', 'gt', 'gte', 'lt', 'lte', 'not_eq'],
		options: null,
		type: 'date',
	},
];

const RULES = [
	{attribute: 'browser_name', id: 'rule-1', operator: 'eq', value: 'Chrome'},
	{
		attribute: 'local_date',
		id: 'rule-2',
		operator: 'lt',
		value: '2026-01-01',
	},
];

function renderRuleGroup(props = {}) {
	const attributesByKey = {};

	ATTRIBUTES.forEach((attribute) => {
		attributesByKey[attribute.key] = attribute;
	});

	return render(
		<AttributesContext.Provider
			value={{
				attributes: ATTRIBUTES,
				getAttribute: (key) => attributesByKey[key],
			}}
		>
			<DndProvider backend={HTML5Backend}>
				<ScreenReaderAnnouncerContextProvider>
					<DragAndDropContextProvider>
						<RuleGroup
							conjunction="AND"
							onConjunctionChange={jest.fn()}
							onReorder={jest.fn()}
							onRuleChange={jest.fn()}
							onRuleDuplicate={jest.fn()}
							onRuleRemove={jest.fn()}
							reorderableItems={RULES.map((rule) => ({
								id: rule.id,
								name: rule.attribute,
							}))}
							rules={RULES}
							{...props}
						/>
					</DragAndDropContextProvider>
				</ScreenReaderAnnouncerContextProvider>
			</DndProvider>
		</AttributesContext.Provider>
	);
}

describe('RuleGroup', () => {
	afterEach(cleanup);

	it('summarizes the criteria for each conjunction', () => {
		const {container: andContainer} = renderRuleGroup();
		const {container: orContainer} = renderRuleGroup({conjunction: 'OR'});

		expect(
			within(andContainer).getByText(/all-rules-must-match/)
		).toBeTruthy();
		expect(
			within(orContainer).getByText(/any-rule-must-match/)
		).toBeTruthy();
	});

	it('notifies when the conjunction changes', async () => {
		const onConjunctionChange = jest.fn();

		const {getByLabelText} = renderRuleGroup({onConjunctionChange});

		await userEvent.selectOptions(
			getByLabelText('match-conjunction'),
			'OR'
		);

		expect(onConjunctionChange).toHaveBeenCalledWith('OR');
	});

	it('removes and duplicates the matching rule by its id', async () => {
		const onRuleDuplicate = jest.fn();
		const onRuleRemove = jest.fn();

		const {getAllByLabelText} = renderRuleGroup({
			onRuleDuplicate,
			onRuleRemove,
		});

		await userEvent.click(getAllByLabelText('remove-x')[0]);
		await userEvent.click(getAllByLabelText('duplicate-x')[1]);

		expect(onRuleRemove).toHaveBeenCalledWith('rule-1');
		expect(onRuleDuplicate).toHaveBeenCalledWith('rule-2');
	});

	it('shows a single insertion line only at the active index', () => {
		const {container: withLine} = renderRuleGroup({insertionIndex: 1});
		const {container: withoutLine} = renderRuleGroup();

		expect(
			withLine.querySelectorAll('.layout__row-builder-insertion-line')
		).toHaveLength(1);
		expect(
			withoutLine.querySelectorAll('.layout__row-builder-insertion-line')
		).toHaveLength(0);
	});
});

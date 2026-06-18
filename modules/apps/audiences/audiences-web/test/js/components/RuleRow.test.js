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
import RuleRow from '../../../src/main/resources/META-INF/resources/js/components/RuleRow';

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

function renderRuleRow(rule, props = {}) {
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
						<RuleRow
							index={0}
							items={[{id: rule.id, name: rule.attribute}]}
							onChange={jest.fn()}
							onDuplicate={jest.fn()}
							onRemove={jest.fn()}
							onReorder={jest.fn()}
							rule={rule}
							{...props}
						/>
					</DragAndDropContextProvider>
				</ScreenReaderAnnouncerContextProvider>
			</DndProvider>
		</AttributesContext.Provider>
	);
}

function operatorValues(container) {
	return Array.from(
		within(container).getByLabelText('x-operator').options
	).map((option) => option.value);
}

describe('RuleRow', () => {
	afterEach(cleanup);

	it('offers the operators that match the attribute type', () => {
		const {container: stringContainer} = renderRuleRow({
			attribute: 'browser_name',
			id: 'rule-1',
			operator: 'eq',
			value: '',
		});
		const {container: dateContainer} = renderRuleRow({
			attribute: 'local_date',
			id: 'rule-2',
			operator: 'lt',
			value: '',
		});

		expect(operatorValues(stringContainer)).toEqual([
			'eq',
			'includes',
			'not_eq',
			'not_includes',
		]);
		expect(operatorValues(dateContainer)).toEqual([
			'eq',
			'gt',
			'gte',
			'lt',
			'lte',
			'not_eq',
		]);
	});

	it('notifies when the operator changes', async () => {
		const onChange = jest.fn();

		const {getByLabelText} = renderRuleRow(
			{
				attribute: 'browser_name',
				id: 'rule-1',
				operator: 'eq',
				value: 'Chrome',
			},
			{onChange}
		);

		await userEvent.selectOptions(getByLabelText('x-operator'), 'not_eq');

		expect(onChange).toHaveBeenCalledWith({
			attribute: 'browser_name',
			id: 'rule-1',
			operator: 'not_eq',
			value: 'Chrome',
		});
	});

	it('notifies when the value changes', async () => {
		const onChange = jest.fn();

		const {getByLabelText} = renderRuleRow(
			{
				attribute: 'browser_name',
				id: 'rule-1',
				operator: 'eq',
				value: '',
			},
			{onChange}
		);

		await userEvent.type(getByLabelText('x-value'), 'F');

		expect(onChange).toHaveBeenCalledWith({
			attribute: 'browser_name',
			id: 'rule-1',
			operator: 'eq',
			value: 'F',
		});
	});

	it('renders nothing for an unknown attribute', () => {
		const {container} = renderRuleRow({
			attribute: 'unknown',
			id: 'rule-3',
			operator: 'eq',
			value: '',
		});

		expect(container.querySelector('.audience-builder-rule')).toBeNull();
	});
});

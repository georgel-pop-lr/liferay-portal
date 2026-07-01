/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DragAndDropContextProvider} from '@liferay/layout-js-components-web';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import ConditionsPanel from '../../../src/main/resources/META-INF/resources/js/components/ConditionsPanel';
import {
	AudiencesCriteriaType,
	Rule,
} from '../../../src/main/resources/META-INF/resources/js/types';

const DragAndDropProvider = DndProvider as unknown as React.FC<
	React.PropsWithChildren<{backend: typeof HTML5Backend}>
>;

const AUDIENCES_CRITERIA_TYPES: AudiencesCriteriaType[] = [
	{
		audiencesCriterias: [
			{
				icon: 'user',
				inputType: 'text',
				key: 'age',
				label: 'Age',
				options: [],
				type: 'number',
			},
			{
				icon: 'globe',
				key: 'country',
				label: 'Country',
				operators: ['eq'],
				options: [],
				type: 'string',
			},
		],
		label: 'User',
	},
];

const RULES: Rule[] = [
	{attribute: 'age', id: 'rule-age', operator: 'gt', value: '18'},
];

const TWO_RULES: Rule[] = [
	{attribute: 'age', id: 'rule-age', operator: 'gt', value: '18'},
	{attribute: 'country', id: 'rule-country', operator: 'eq', value: 'us'},
];

function renderConditionsPanel({
	dispatch = jest.fn(),
	rules = [] as Rule[],
} = {}) {
	render(
		<DragAndDropProvider backend={HTML5Backend}>
			<DragAndDropContextProvider>
				<ConditionsPanel
					audiencesCriteriaTypes={AUDIENCES_CRITERIA_TYPES}
					conjunction="AND"
					dispatch={dispatch}
					rules={rules}
				/>
			</DragAndDropContextProvider>
		</DragAndDropProvider>
	);

	return {dispatch};
}

describe('ConditionsPanel', () => {
	it('shows the empty state when there are no rules', () => {
		renderConditionsPanel();

		expect(screen.getByText('no-criteria-yet')).toBeTruthy();
	});

	it('renders the given rules', () => {
		renderConditionsPanel({rules: RULES});

		expect(screen.getByText('Age')).toBeTruthy();
		expect(screen.getByText('is-greater-than')).toBeTruthy();
	});

	it('dispatches a duplicate action', async () => {
		const {dispatch} = renderConditionsPanel({rules: RULES});

		await userEvent.click(screen.getByLabelText('duplicate'));

		expect(dispatch).toHaveBeenCalledWith({
			index: 0,
			type: 'DUPLICATE_RULE',
		});
	});

	it('navigates and reorders the rows with the keyboard', async () => {
		const {dispatch} = renderConditionsPanel({rules: TWO_RULES});

		const rows = screen.getAllByRole('menuitem');

		expect(rows[0].tabIndex).toBe(0);
		expect(rows[1].tabIndex).toBe(-1);
		expect(screen.getAllByLabelText('move-x')[0].tabIndex).toBe(0);

		rows[0].focus();

		await userEvent.keyboard('{ArrowDown}');

		expect(document.activeElement).toBe(rows[1]);
		expect(rows[0].tabIndex).toBe(-1);
		expect(rows[1].tabIndex).toBe(0);

		await userEvent.keyboard('{ArrowUp}');

		expect(document.activeElement).toBe(rows[0]);

		screen.getAllByLabelText('move-x')[0].focus();

		await userEvent.keyboard('{ArrowDown}');

		expect(document.activeElement).toBe(rows[1]);

		await userEvent.keyboard('{ArrowUp}');

		expect(document.activeElement).toBe(rows[0]);

		screen.getAllByLabelText('move-x')[0].focus();

		await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');

		expect(dispatch).toHaveBeenCalledWith({
			rules: [TWO_RULES[1], TWO_RULES[0]],
			type: 'REORDER_RULES',
		});
	});
});

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DragAndDropContextProvider} from '@liferay/layout-js-components-web';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, {useReducer} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import AttributesSidebar from '../../../src/main/resources/META-INF/resources/js/components/AttributesSidebar';
import {reducer} from '../../../src/main/resources/META-INF/resources/js/reducer';
import {AudiencesCriteriaType} from '../../../src/main/resources/META-INF/resources/js/types';

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
				icon: 'user',
				inputType: 'text',
				key: 'city',
				label: 'City',
				options: [],
				type: 'string',
			},
		],
		key: 'user',
		label: 'User',
	},
	{
		audiencesCriterias: [
			{
				icon: 'globe',
				inputType: 'text',
				key: 'browser',
				label: 'Browser',
				options: [],
				type: 'string',
			},
		],
		key: 'session',
		label: 'Session',
	},
];

function renderSidebar() {
	const dispatch = jest.fn();

	function Sidebar() {
		const [state, reducerDispatch] = useReducer(reducer, {
			conjunction: 'AND',
			name: '',
			rules: [],
		});

		return (
			<AttributesSidebar
				audiencesCriteriaTypes={AUDIENCES_CRITERIA_TYPES}
				dispatch={(action) => {
					dispatch(action);
					reducerDispatch(action);
				}}
				rules={state.rules}
			/>
		);
	}

	render(
		<DragAndDropProvider backend={HTML5Backend}>
			<DragAndDropContextProvider>
				<Sidebar />
			</DragAndDropContextProvider>
		</DragAndDropProvider>
	);

	return {dispatch};
}

function getAttributeItems() {
	return within(screen.getByRole('toolbar')).getAllByRole('button');
}

describe('AttributesSidebar', () => {
	it('lists and filters the attributes', async () => {
		renderSidebar();

		expect(screen.getByText('Age')).toBeTruthy();
		expect(screen.getByText('City')).toBeTruthy();
		expect(screen.queryByText('Browser')).toBeNull();

		await userEvent.selectOptions(
			screen.getByLabelText('attributes-types'),
			screen.getByRole('option', {name: 'Session'})
		);

		expect(screen.getByText('Browser')).toBeTruthy();
		expect(screen.queryByText('Age')).toBeNull();

		await userEvent.selectOptions(
			screen.getByLabelText('attributes-types'),
			screen.getByRole('option', {name: 'User'})
		);

		await userEvent.type(screen.getByLabelText('search-attributes'), 'cit');

		await waitFor(() => expect(screen.queryByText('Age')).toBeNull());

		expect(screen.getByText('City')).toBeTruthy();

		await userEvent.clear(screen.getByLabelText('search-attributes'));
		await userEvent.type(screen.getByLabelText('search-attributes'), 'zzz');

		await waitFor(() =>
			expect(screen.getByText('no-attributes-were-found')).toBeTruthy()
		);
	});

	it('navigates, adds, and inserts conditions with the keyboard', async () => {
		const {dispatch} = renderSidebar();

		const items = getAttributeItems();

		items[0].focus();

		await userEvent.keyboard('{ArrowDown}');

		expect(document.activeElement).toBe(items[1]);

		await userEvent.keyboard('{ArrowUp}');

		expect(document.activeElement).toBe(items[0]);

		await userEvent.keyboard('{Enter}');

		expect(dispatch).toHaveBeenCalledWith({
			audiencesCriteria: expect.objectContaining({key: 'age'}),
			index: 0,
			type: 'ADD_RULE',
		});

		getAttributeItems()[1].focus();

		await userEvent.keyboard('{Enter}{ArrowUp}{Enter}');

		expect(dispatch).toHaveBeenCalledWith({
			audiencesCriteria: expect.objectContaining({key: 'city'}),
			index: 0,
			type: 'ADD_RULE',
		});
	});
});

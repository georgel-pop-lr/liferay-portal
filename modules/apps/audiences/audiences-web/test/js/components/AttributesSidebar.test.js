/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {cleanup, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import AttributesContext from '../../../src/main/resources/META-INF/resources/js/AttributesContext';
import AttributesSidebar from '../../../src/main/resources/META-INF/resources/js/components/AttributesSidebar';

const ATTRIBUTES = [
	{icon: 'desktop', key: 'browser_name', label: 'browser-name'},
	{icon: 'desktop', key: 'browser_version', label: 'browser-version'},
	{icon: 'globe', key: 'hostname', label: 'hostname'},
	{icon: 'calendar', key: 'local_date', label: 'local-date'},
	{icon: 'desktop', key: 'user_agent', label: 'user-agent'},
];

function renderSidebar(onPickUp = jest.fn(), props = {}) {
	return render(
		<AttributesContext.Provider
			value={{attributes: ATTRIBUTES, getAttribute: () => undefined}}
		>
			<DndProvider backend={HTML5Backend}>
				<AttributesSidebar onPickUp={onPickUp} {...props} />
			</DndProvider>
		</AttributesContext.Provider>
	);
}

describe('AttributesSidebar', () => {
	afterEach(cleanup);

	it('renders the full flat list of criteria items', () => {
		const {getByText} = renderSidebar();

		expect(getByText('browser-name')).toBeTruthy();
		expect(getByText('local-date')).toBeTruthy();
		expect(getByText('user-agent')).toBeTruthy();
	});

	it('filters the list as the user types in the search field', async () => {
		const {getByLabelText, queryByText} = renderSidebar();

		await userEvent.type(getByLabelText('search-attributes'), 'browser');

		expect(queryByText('browser-name')).toBeTruthy();
		expect(queryByText('browser-version')).toBeTruthy();
		expect(queryByText('hostname')).toBeNull();
	});

	it('picks up an item for placement when activated with the keyboard', async () => {
		const onPickUp = jest.fn();

		const {getByText} = renderSidebar(onPickUp);

		await userEvent.click(getByText('browser-name').closest('li'));
		await userEvent.keyboard('{Enter}');

		expect(onPickUp).toHaveBeenCalledWith('browser_name');
	});

	it('keeps a single tab stop and roves focus with the arrow keys', async () => {
		const {getAllByRole} = renderSidebar();

		const options = getAllByRole('button');

		expect(options[0].tabIndex).toBe(0);
		expect(options[1].tabIndex).toBe(-1);

		await userEvent.click(options[0]);
		await userEvent.keyboard('{ArrowDown}');

		expect(options[0].tabIndex).toBe(-1);
		expect(options[1].tabIndex).toBe(0);
		expect(document.activeElement).toBe(options[1]);

		await userEvent.keyboard('{ArrowUp}');

		expect(options[0].tabIndex).toBe(0);
		expect(document.activeElement).toBe(options[0]);

		await userEvent.click(options[2]);

		expect(options[2].tabIndex).toBe(0);

		await userEvent.keyboard('{ArrowDown}');

		expect(document.activeElement).toBe(options[3]);
	});

	it('resets the active item to the top when the query changes', async () => {
		const {getAllByRole, getByLabelText} = renderSidebar();

		await userEvent.click(getAllByRole('button')[0]);
		await userEvent.keyboard('{ArrowDown}');

		expect(getAllByRole('button')[1].tabIndex).toBe(0);

		await userEvent.type(getByLabelText('search-attributes'), 'browser');

		const filteredOptions = getAllByRole('button');

		expect(filteredOptions).toHaveLength(2);
		expect(filteredOptions[0].tabIndex).toBe(0);
	});

	it('restores focus to the pending attribute', () => {
		const onFocusRestored = jest.fn();

		const {getByText} = renderSidebar(jest.fn(), {
			onFocusRestored,
			pendingFocusKey: 'hostname',
		});

		expect(document.activeElement).toBe(
			getByText('hostname').closest('li')
		);
		expect(onFocusRestored).toHaveBeenCalled();
	});
});

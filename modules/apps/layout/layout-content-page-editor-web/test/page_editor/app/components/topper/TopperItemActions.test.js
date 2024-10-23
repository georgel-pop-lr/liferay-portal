/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TopperItemActions from '../../../../../src/main/resources/META-INF/resources/page_editor/app/components/topper/TopperItemActions';
import {LAYOUT_DATA_ITEM_TYPES} from '../../../../../src/main/resources/META-INF/resources/page_editor/app/config/constants/layoutDataItemTypes';
import {
	ClipboardContextProvider,
	useSetCopiedItemIds,
} from '../../../../../src/main/resources/META-INF/resources/page_editor/app/contexts/ClipboardContext';
import {StoreAPIContextProvider} from '../../../../../src/main/resources/META-INF/resources/page_editor/app/contexts/StoreContext';
import deleteItem from '../../../../../src/main/resources/META-INF/resources/page_editor/app/thunks/deleteItem';
import pasteItem from '../../../../../src/main/resources/META-INF/resources/page_editor/app/thunks/pasteItem';
import canBeCopied from '../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/canBeCopied';
import canBeDuplicated from '../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/canBeDuplicated';
import canBeRemoved from '../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/canBeRemoved';
import isItemWidget from '../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/isItemWidget';

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/contexts/ClipboardContext',
	() => {
		const setCopiedItemIds = jest.fn();

		return {
			...jest.requireActual(
				'../../../../../src/main/resources/META-INF/resources/page_editor/app/contexts/ClipboardContext'
			),
			useCopiedItemIds: () => ['itemId2'],
			useSetCopiedItemIds: () => setCopiedItemIds,
		};
	}
);

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/thunks/deleteItem',
	() => jest.fn()
);

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/thunks/pasteItem',
	() => jest.fn()
);

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/canBeCopied',
	() => jest.fn()
);

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/canBeDuplicated',
	() => jest.fn()
);

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/canBeRemoved',
	() => jest.fn()
);

jest.mock(
	'../../../../../src/main/resources/META-INF/resources/page_editor/app/utils/isItemWidget',
	() => jest.fn()
);

const LAYOUT_DATA = {
	items: {
		itemId1: {
			children: [],
			config: {styles: {}},
			itemId: 'itemId1',
			parentId: null,
			type: LAYOUT_DATA_ITEM_TYPES.row,
		},
		itemId2: {
			children: [],
			config: {styles: {}},
			itemId: 'itemId2',
			parentId: null,
			type: LAYOUT_DATA_ITEM_TYPES.row,
		},
	},
};

const renderTopperItemActions = ({
	isDisabled = false,
	itemId = 'itemId1',
	layoutData = LAYOUT_DATA,
} = {}) => {
	const item = layoutData.items[itemId];

	return render(
		<StoreAPIContextProvider
			getState={() => ({
				layoutData,
			})}
		>
			<ClipboardContextProvider>
				<TopperItemActions disabled={isDisabled} item={item} />
			</ClipboardContextProvider>
		</StoreAPIContextProvider>
	);
};

describe('TopperItemActions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('does not open TopperItemActions if disabled', () => {
		const {baseElement} = renderTopperItemActions({isDisabled: true});

		expect(baseElement.querySelector('.dropdown')).toBeInTheDocument();
		expect(baseElement.querySelector('.dropdown-toggle')).toHaveAttribute(
			'disabled'
		);
	});

	it('opens TopperItemActions if not disabled', () => {
		const {baseElement} = renderTopperItemActions();

		userEvent.click(baseElement.querySelector('.dropdown-toggle'));

		expect(
			baseElement.querySelector('.dropdown-menu.show')
		).toBeInTheDocument();
	});

	it('calls setCopiedItemIds and deleteItem when Cut action is pressed', () => {
		Liferay.FeatureFlags['LPD-18221'] = true;

		canBeDuplicated.mockImplementation(() => true);

		canBeRemoved.mockImplementation(() => true);

		const setCopiedItemIds = useSetCopiedItemIds();

		renderTopperItemActions();

		userEvent.click(screen.getByText('cut'));

		expect(deleteItem).toBeCalledWith(
			expect.objectContaining({
				itemIds: ['itemId1'],
			})
		);

		expect(setCopiedItemIds).toBeCalledWith(
			expect.objectContaining(['itemId1'])
		);

		Liferay.FeatureFlags['LPD-18221'] = false;
	});

	it('calls setCopiedItemIds when Copy action is pressed', () => {
		Liferay.FeatureFlags['LPD-18221'] = true;

		canBeDuplicated.mockImplementation(() => true);

		const setCopiedItemIds = useSetCopiedItemIds();

		renderTopperItemActions();

		userEvent.click(screen.getByText('copy'));

		expect(setCopiedItemIds).toBeCalledWith(
			expect.objectContaining(['itemId1'])
		);

		Liferay.FeatureFlags['LPD-18221'] = false;
	});

	it('calls pasteItem when Paste action is pressed', () => {
		Liferay.FeatureFlags['LPD-18221'] = true;

		canBeCopied.mockImplementation(() => true);

		canBeDuplicated.mockImplementation(() => true);

		renderTopperItemActions();

		userEvent.click(screen.getByText('paste'));

		expect(pasteItem).toBeCalledWith(
			expect.objectContaining({
				copiedItemIds: ['itemId2'],
				parentItemId: 'itemId1',
			})
		);

		Liferay.FeatureFlags['LPD-18221'] = false;
	});

	it('calls pasteItem when Paste action is pressed on a non-instantiable widget', () => {
		Liferay.FeatureFlags['LPD-18221'] = true;

		canBeCopied.mockImplementation(() => true);

		canBeDuplicated.mockImplementation(() => false);

		isItemWidget.mockImplementation(() => true);

		renderTopperItemActions();

		userEvent.click(screen.getByText('paste'));

		expect(pasteItem).toBeCalledWith(
			expect.objectContaining({
				copiedItemIds: ['itemId2'],
				parentItemId: 'itemId1',
			})
		);

		Liferay.FeatureFlags['LPD-18221'] = false;
	});

	it('should not call pasteItem when item can not be copied', () => {
		Liferay.FeatureFlags['LPD-18221'] = true;

		canBeCopied.mockImplementation(() => false);

		canBeDuplicated.mockImplementation(() => true);

		renderTopperItemActions();

		userEvent.click(screen.getByText('paste'));

		expect(pasteItem).toBeCalledTimes(0);

		Liferay.FeatureFlags['LPD-18221'] = false;
	});

	it('should not display Cut, Copy, and Paste actions when the item cannot be duplicated or removed', () => {
		Liferay.FeatureFlags['LPD-18221'] = true;

		canBeDuplicated.mockImplementation(() => false);

		isItemWidget.mockImplementation(() => false);

		canBeRemoved.mockImplementation(() => false);

		renderTopperItemActions();

		expect(screen.queryByText('cut')).not.toBeInTheDocument();

		expect(screen.queryByText('copy')).not.toBeInTheDocument();

		expect(screen.queryByText('paste')).not.toBeInTheDocument();

		Liferay.FeatureFlags['LPD-18221'] = false;
	});
});

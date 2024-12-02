/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	LAYOUT_DATA_ITEM_TYPES,
	LayoutDataItemType,
} from '../../../../src/main/resources/META-INF/resources/page_editor/app/config/constants/layoutDataItemTypes';
import {getDropTargetId} from '../../../../src/main/resources/META-INF/resources/page_editor/app/utils/isMovementValid';
import {LayoutData} from '../../../../src/main/resources/META-INF/resources/page_editor/types/layout_data/LayoutData';

const getLayoutData = (
	type: LayoutDataItemType = LAYOUT_DATA_ITEM_TYPES.fragment
): LayoutData => ({
	items: {
		collection01: {
			children: ['collectionItem01'],
			config: {
				collection: {},
			},
			itemId: 'collection01',
			parentId: 'root01',
			type: LAYOUT_DATA_ITEM_TYPES.collection,
		},
		collectionItem01: {
			children: [],
			config: {},
			itemId: 'collectionItem01',
			parentId: 'collection01',
			type: LAYOUT_DATA_ITEM_TYPES.collectionItem,
		},
		form01: {
			children: ['formStepContainer01'],
			config: {
				formType: 'multistep',
			},
			itemId: 'form01',
			parentId: 'root01',
			type: LAYOUT_DATA_ITEM_TYPES.form,
		},
		formStep01: {
			children: [],
			config: {},
			itemId: 'formStep01',
			parentId: 'formStepContainer01',
			type: LAYOUT_DATA_ITEM_TYPES.formStep,
		},
		formStepContainer01: {
			children: ['formStep01'],
			config: {},
			itemId: 'formStepContainer01',
			parentId: 'form01',
			type: LAYOUT_DATA_ITEM_TYPES.formStepContainer,
		},
		fragment01: {
			config: {fragmentEntryLinkId: '01'},
			itemId: 'fragment01',
			parentId: 'root01',
			type,
		},
		root01: {
			config: {},
			itemId: 'root01',
			type: LAYOUT_DATA_ITEM_TYPES.root,
		},
	},
	rootItems: {
		main: 'root01',
	},
});

describe('getDropTargetId', () => {
	it('returns column id', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.column)
			)
		).toBe('fragment01');
	});

	it('returns container id', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.container)
			)
		).toBe('fragment01');
	});

	it('returns collection id if collection not mapped', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.collection)
			)
		).toBe('fragment01');
	});

	it('returns collectionItem id', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.collectionItem)
			)
		).toBe('fragment01');
	});

	it('returns dropZone id', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.dropZone)
			)
		).toBe('fragment01');
	});

	it('returns form id', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.form)
			)
		).toBe('fragment01');
	});

	it('returns formStep id', () => {
		expect(
			getDropTargetId(
				'fragment01',
				getLayoutData(LAYOUT_DATA_ITEM_TYPES.formStep)
			)
		).toBe('fragment01');
	});

	it('returns root id ', () => {
		expect(getDropTargetId('fragment01', getLayoutData())).toBe('root01');
	});

	it('returns collectionItem id if collection is mapped', () => {
		expect(getDropTargetId('collection01', getLayoutData())).toBe(
			'collectionItem01'
		);
	});

	it('returns first stepper id from form stepper', () => {
		expect(getDropTargetId('form01', getLayoutData())).toBe('formStep01');
	});
});

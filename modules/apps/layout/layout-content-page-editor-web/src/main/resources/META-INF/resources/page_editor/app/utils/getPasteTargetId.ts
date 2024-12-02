/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {LayoutData} from '../../types/layout_data/LayoutData';
import {LAYOUT_DATA_ITEM_TYPES} from '../config/constants/layoutDataItemTypes';

const PARENT_TYPES = [
	LAYOUT_DATA_ITEM_TYPES.column,
	LAYOUT_DATA_ITEM_TYPES.container,
	LAYOUT_DATA_ITEM_TYPES.collection,
	LAYOUT_DATA_ITEM_TYPES.dropZone,
	LAYOUT_DATA_ITEM_TYPES.form,
	LAYOUT_DATA_ITEM_TYPES.formStep,
	LAYOUT_DATA_ITEM_TYPES.root,
];

export function getPasteTargetId(
	targetId: string,
	layoutData: LayoutData
): string {
	const target = layoutData.items[targetId];
	const layoutDataItems = layoutData.items;

	// return first stepper id for multistep form

	if (
		target.type === LAYOUT_DATA_ITEM_TYPES.form &&
		target.config.formType === 'multistep'
	) {
		for (const childItemId of target.children) {
			const layoutDataItem = layoutDataItems[childItemId];
			if (
				layoutDataItem.type === LAYOUT_DATA_ITEM_TYPES.formStepContainer
			) {
				return layoutDataItems[layoutDataItem.children[0]].itemId;
			}
		}
	}

	// return collectionItem id if collection is mapped

	if (
		target.type === LAYOUT_DATA_ITEM_TYPES.collection &&
		target.config.collection
	) {
		return target.children[0];
	}

	// return available parent id

	if (PARENT_TYPES.some((type) => type === target.type)) {
		return target.itemId;
	}

	const parent = layoutDataItems[target.parentId];

	// if not found go deeper and check for available parent id

	return getPasteTargetId(parent.itemId, layoutData);
}

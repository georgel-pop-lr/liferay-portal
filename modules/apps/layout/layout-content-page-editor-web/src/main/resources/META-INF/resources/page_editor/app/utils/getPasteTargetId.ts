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
	const items = layoutData.items;

	// Return first step id for multistep form

	if (
		target.type === LAYOUT_DATA_ITEM_TYPES.form &&
		target.config.formType === 'multistep'
	) {
		for (const childId of target.children) {
			const child = items[childId];

			if (child.type === LAYOUT_DATA_ITEM_TYPES.formStepContainer) {
				return items[child.children[0]].itemId;
			}
		}
	}

	// Return collectionItem id if collection is mapped

	if (
		target.type === LAYOUT_DATA_ITEM_TYPES.collection &&
		target.config.collection
	) {
		return target.children[0];
	}

	// Return available parent id

	if (PARENT_TYPES.some((type) => type === target.type)) {
		return target.itemId;
	}

	const parent = items[target.parentId];

	// If not found go deeper and check for available parent id

	return getPasteTargetId(parent.itemId, layoutData);
}

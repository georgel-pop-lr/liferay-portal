/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {MillerColumnItem} from '../types/MillerColumnItem';

export function getMillerColumnsItem(
	columnIndex: number | undefined,
	itemIndex: number | undefined,
	items: Map<string, MillerColumnItem>
) {
	return Array.from(items.values()).find(
		(item) =>
			item.columnIndex === columnIndex && item.itemIndex === itemIndex
	);
}

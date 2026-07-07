/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DropPosition} from './useDragAndDrop';

export default function getNextKeyboardPosition(
	{index, position}: {index: number; position: DropPosition},
	key: string,
	itemsLength: number
): {index: number; position: DropPosition} {
	let nextIndex = index;
	let nextPosition = position;

	if (key === 'ArrowDown') {
		if (nextPosition === 'top') {
			nextPosition = 'bottom';
		}
		else if (nextIndex < itemsLength - 1) {
			nextIndex = nextIndex + 1;
		}
	}
	else if (key === 'ArrowUp') {
		if (nextPosition === 'bottom') {
			nextPosition = 'top';
		}
		else if (nextIndex > 0) {
			nextIndex = nextIndex - 1;
		}
	}

	return {index: nextIndex, position: nextPosition};
}

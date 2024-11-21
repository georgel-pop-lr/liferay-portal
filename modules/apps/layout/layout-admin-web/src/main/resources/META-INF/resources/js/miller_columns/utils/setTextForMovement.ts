/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {sub} from 'frontend-js-web';

import {DROP_POSITIONS} from '../constants/dropPositions';
import {MovementTarget} from '../contexts/KeyboardMovementContext';
import {getMillerColumnsItem} from './getMillerColumnsItem';

import type {MillerColumnItem} from '../types/MillerColumnItem';

export function setTextForMovement({
	isFinalPosition = false,
	isInitialPosition = false,
	items,
	setText,
	sources,
	target,
}: {
	isFinalPosition?: boolean;
	isInitialPosition?: boolean;
	items: Map<string, MillerColumnItem>;
	setText: (value: string) => void;
	sources: MillerColumnItem[];
	target: MovementTarget;
}) {
	const targetItem = getMillerColumnsItem(
		target?.columnIndex,
		target?.itemIndex,
		items
	);
	setText(
		`${
			isInitialPosition
				? Liferay.Language.get(
						'use-arrows-to-move-it-and-press-enter-to-select-the-new-position-press-esc-to-cancel'
					)
				: ''
		} ${
			isFinalPosition
				? sub(Liferay.Language.get('page-x-placed'), sources[0].title)
				: sub(Liferay.Language.get('move-page-x'), sources[0].title)
		} ${
			target?.position === DROP_POSITIONS.top
				? sub(
						Liferay.Language.get('at-the-top-of-the-page-x'),
						targetItem?.title || ''
					)
				: ''
		} ${
			target?.position === DROP_POSITIONS.middle
				? sub(
						Liferay.Language.get('inside-page-x'),
						targetItem?.title || ''
					)
				: ''
		} ${
			target?.position === DROP_POSITIONS.bottom
				? sub(
						Liferay.Language.get('at-the-bottom-of-the-page-x'),
						targetItem?.title || ''
					)
				: ''
		}`
	);
}

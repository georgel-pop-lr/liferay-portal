/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	getNextKeyboardPosition,
	useKeyboardItem,
	useScreenReaderAnnounce,
	useUpdateKeyboardItem,
} from '@liferay/layout-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useCallback, useState} from 'react';

interface DragItem {
	id: string;
	name: string;
}

interface Props {
	item: DragItem;
	items: DragItem[];
	onInsert: (index: number) => void;
}

export default function useKeyboardInsert({item, items, onInsert}: Props) {
	const [isPlacing, setIsPlacing] = useState(false);

	const announce = useScreenReaderAnnounce();
	const keyboardItem = useKeyboardItem();
	const updateKeyboardItem = useUpdateKeyboardItem();

	const finishPlacement = useCallback(() => {
		updateKeyboardItem({index: null, position: null});

		setIsPlacing(false);
	}, [updateKeyboardItem]);

	const handleKeyboardInsert = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			const {key} = event;

			if (isPlacing && (key === 'ArrowDown' || key === 'ArrowUp')) {
				event.preventDefault();
				event.stopPropagation();

				const {index: nextIndex, position: nextPosition} =
					getNextKeyboardPosition(
						{
							index: keyboardItem.index ?? 0,
							position: keyboardItem.position,
						},
						key,
						items.length
					);

				announce(
					sub(Liferay.Language.get('move-x-at-the-x-of-x'), [
						item.name,
						nextPosition,
						items[nextIndex].name,
					])
				);

				updateKeyboardItem({index: nextIndex, position: nextPosition});

				return;
			}

			if (key === 'Enter' || key === ' ') {
				event.preventDefault();
				event.stopPropagation();

				if (!isPlacing) {
					if (!items.length) {
						onInsert(0);

						announce(Liferay.Language.get('a-condition-was-added'));

						return;
					}

					setIsPlacing(true);

					updateKeyboardItem({
						index: items.length - 1,
						name: item.name,
						position: 'bottom',
					});

					announce(
						Liferay.Language.get(
							'use-arrows-to-move-it-and-press-enter-to-select-the-new-position-press-esc-to-cancel'
						)
					);

					return;
				}

				if (keyboardItem.index === null) {
					return;
				}

				onInsert(
					keyboardItem.position === 'bottom'
						? keyboardItem.index + 1
						: keyboardItem.index
				);

				announce(Liferay.Language.get('a-condition-was-added'));

				finishPlacement();

				return;
			}

			if (key === 'Escape' && isPlacing) {
				event.preventDefault();
				event.stopPropagation();

				finishPlacement();
			}
		},
		[
			announce,
			finishPlacement,
			isPlacing,
			item,
			items,
			keyboardItem,
			onInsert,
			updateKeyboardItem,
		]
	);

	return {handleKeyboardInsert, isPlacing};
}

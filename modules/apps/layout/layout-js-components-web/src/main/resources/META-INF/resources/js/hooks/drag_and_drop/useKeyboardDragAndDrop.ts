/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {sub} from 'frontend-js-web';
import {useCallback, useMemo, useState} from 'react';

import {
	useKeyboardItem,
	useUpdateKeyboardItem,
} from '../../contexts/DragAndDropContext';
import {useScreenReaderAnnounce} from '../../contexts/ScreenReaderContext';
import getNextKeyboardPosition from './getNextKeyboardPosition';

interface Props<T extends {id: string}> {
	draggedItem: T;
	draggedItemIndex: number;
	items: T[];
	onDrop: (items: T[]) => void;
}

export default function useKeyboardDragAndDrop<
	T extends {id: string; name: string},
>({draggedItem, draggedItemIndex, items, onDrop}: Props<T>) {
	const [isActive, setIsActive] = useState(false);

	const announce = useScreenReaderAnnounce();
	const keyboardItem = useKeyboardItem();
	const updateKeyboardItem = useUpdateKeyboardItem();

	const isTarget = useMemo(
		() => keyboardItem.index === draggedItemIndex,
		[draggedItemIndex, keyboardItem]
	);

	const handleKeyboardDragAndDrop = useCallback(
		async (event: React.KeyboardEvent<HTMLButtonElement>) => {
			event.stopPropagation();

			const {key} = event;

			if (key === 'Escape' && isActive) {
				setIsActive(false);

				updateKeyboardItem({
					index: null,
					position: null,
				});

				return;
			}

			if (key === 'Enter') {
				if (!isActive) {
					setIsActive(true);

					updateKeyboardItem({
						index: draggedItemIndex,
						name: draggedItem.name,
						position:
							draggedItemIndex === items.length - 1
								? 'top'
								: 'bottom',
					});

					announce(
						Liferay.Language.get(
							'use-arrows-to-move-it-and-press-enter-to-select-the-new-position-press-esc-to-cancel'
						)
					);

					return;
				}

				const newItems = [...items];
				const [movedItem] = newItems.splice(draggedItemIndex, 1);

				newItems.splice(keyboardItem.index!, 0, movedItem);

				if (draggedItemIndex !== keyboardItem.index) {
					onDrop?.(newItems);

					announce(
						sub(Liferay.Language.get('x-moved-to-the-x-of-x'), [
							draggedItem.name,
							keyboardItem.position,
							items[keyboardItem.index!].name,
						])
					);
				}

				updateKeyboardItem({
					index: null,
				});

				setIsActive(false);

				return;
			}

			if (!isActive) {
				return;
			}

			const {index: nextIndex, position: nextPosition} =
				getNextKeyboardPosition(
					{
						index: keyboardItem.index!,
						position: keyboardItem.position,
					},
					key,
					items.length
				);

			announce(
				sub(Liferay.Language.get('move-x-at-the-x-of-x'), [
					draggedItem.name,
					nextPosition,
					items[nextIndex].name,
				])
			);

			updateKeyboardItem({
				index: nextIndex,
				position: nextPosition,
			});
		},
		[
			announce,
			draggedItem,
			draggedItemIndex,
			isActive,
			items,
			keyboardItem,
			onDrop,
			setIsActive,
			updateKeyboardItem,
		]
	);

	return {
		handleKeyboardDragAndDrop,
		isKeyboardDragging: isActive,
		isKeyboardDropBottomPosition:
			isTarget && keyboardItem.position === 'bottom',
		isKeyboardDropTarget: isTarget,
		isKeyboardDropTopPosition: isTarget && keyboardItem.position === 'top',
	};
}

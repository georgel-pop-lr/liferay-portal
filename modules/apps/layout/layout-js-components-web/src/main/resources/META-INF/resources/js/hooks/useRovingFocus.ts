/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useRef, useState} from 'react';

export interface RovingItemProps {
	onFocus: () => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
	ref: (node: HTMLElement | null) => void;
	tabIndex: number;
}

interface Props {
	itemCount: number;
	loop?: boolean;
}

export default function useRovingFocus({itemCount, loop = false}: Props) {
	const [activeIndex, setActiveIndex] = useState(0);

	const itemRefs = useRef<Array<HTMLElement | null>>([]);

	const activeItemIndex = Math.min(activeIndex, Math.max(0, itemCount - 1));

	const focusItem = (index: number) => {
		const nextIndex = Math.max(0, Math.min(index, itemCount - 1));

		setActiveIndex(nextIndex);

		itemRefs.current[nextIndex]?.focus();
	};

	const getItemProps = (index: number): RovingItemProps => ({
		onFocus: () => setActiveIndex(index),
		onKeyDown: (event) => {
			if (event.target !== event.currentTarget || !itemCount) {
				return;
			}

			let nextIndex;

			if (event.key === 'ArrowDown') {
				nextIndex = loop
					? (index + 1) % itemCount
					: Math.min(index + 1, itemCount - 1);
			}
			else if (event.key === 'ArrowUp') {
				nextIndex = loop
					? (index - 1 + itemCount) % itemCount
					: Math.max(index - 1, 0);
			}
			else if (event.key === 'Home') {
				nextIndex = 0;
			}
			else if (event.key === 'End') {
				nextIndex = itemCount - 1;
			}
			else {
				return;
			}

			event.preventDefault();

			focusItem(nextIndex);
		},
		ref: (node) => {
			itemRefs.current[index] = node;
		},
		tabIndex: index === activeItemIndex ? 0 : -1,
	});

	return {focusItem, getItemProps};
}

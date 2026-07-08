/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';
import {useDrop} from 'react-dnd';

import {DRAG_TYPES} from '../constants/dragTypes';
import {AudiencesCriteria} from '../types';
import getDropPosition from './getDropPosition';
import {AttributeDragItem, DropPosition} from './types';

interface Options {
	dropItemRef?: React.RefObject<HTMLElement>;
	index?: number;
	onAddRule: (audiencesCriteria: AudiencesCriteria, index?: number) => void;
}

export default function useAttributeDrop({
	dropItemRef,
	index,
	onAddRule,
}: Options) {
	const [dropPosition, setDropPosition] = useState<DropPosition>(null);

	const [{canDrop, isOver}, dropRef] = useDrop<
		AttributeDragItem,
		void,
		{canDrop: boolean; isOver: boolean}
	>({
		accept: DRAG_TYPES.ATTRIBUTE,
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
			isOver: monitor.isOver(),
		}),
		drop: (item, monitor) => {
			if (dropItemRef && index !== undefined) {
				const position = getDropPosition(dropItemRef, monitor);

				onAddRule(
					item.audiencesCriteria,
					position === 'bottom' ? index + 1 : index
				);
			}
			else {
				onAddRule(item.audiencesCriteria);
			}
		},
		hover: (item, monitor) => {
			if (dropItemRef) {
				setDropPosition(
					monitor.isOver()
						? getDropPosition(dropItemRef, monitor)
						: null
				);
			}
		},
	});

	return {canDrop, dropPosition, dropRef, isOver};
}

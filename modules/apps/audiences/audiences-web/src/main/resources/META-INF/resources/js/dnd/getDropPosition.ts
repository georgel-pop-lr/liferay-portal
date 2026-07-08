/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {DropTargetMonitor} from 'react-dnd';

import {DropPosition} from './types';

export default function getDropPosition(
	ref: React.RefObject<HTMLElement>,
	monitor: DropTargetMonitor
): DropPosition {
	const clientOffset = monitor.getClientOffset();

	if (!ref.current || !clientOffset) {
		return null;
	}

	const dropItemBoundingRect = ref.current.getBoundingClientRect();
	const hoverClientY = clientOffset.y - dropItemBoundingRect.top;

	return hoverClientY < dropItemBoundingRect.height / 2 ? 'top' : 'bottom';
}

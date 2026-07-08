/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useEffect} from 'react';
import {useDrag} from 'react-dnd';
import {getEmptyImage} from 'react-dnd-html5-backend';

import {DRAG_TYPES} from '../constants/dragTypes';
import {AudiencesCriteria} from '../types';

export default function useAttributeDrag(audiencesCriteria: AudiencesCriteria) {
	const [{isDragging}, handlerRef, previewRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: {
			audiencesCriteria,
			icon: audiencesCriteria.icon,
			name: audiencesCriteria.label,
			type: DRAG_TYPES.ATTRIBUTE,
		},
	});

	useEffect(() => {
		previewRef(getEmptyImage(), {captureDraggingState: true});
	}, [previewRef]);

	return {handlerRef, isDragging};
}

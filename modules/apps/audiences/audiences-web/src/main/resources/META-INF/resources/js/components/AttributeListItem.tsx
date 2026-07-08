/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import {RovingItemProps} from '@liferay/layout-js-components-web';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React from 'react';

import {DragItem} from '../dnd/types';
import useAttributeDrag from '../dnd/useAttributeDrag';
import useKeyboardInsert from '../dnd/useKeyboardInsert';
import {AudiencesCriteria} from '../types';

interface IProps {
	audiencesCriteria: AudiencesCriteria;
	iconColor: string;
	items: DragItem[];
	onInsert: (audiencesCriteria: AudiencesCriteria, index: number) => void;
	rovingProps: RovingItemProps;
}

export default function AttributeListItem({
	audiencesCriteria,
	iconColor,
	items,
	onInsert,
	rovingProps,
}: IProps) {
	const {handlerRef, isDragging} = useAttributeDrag(audiencesCriteria);

	const {handleKeyboardInsert, isPlacing} = useKeyboardInsert({
		item: {id: audiencesCriteria.key, name: audiencesCriteria.label},
		items,
		onInsert: (index) => onInsert(audiencesCriteria, index),
	});

	const setRefs = (node: HTMLDivElement | null) => {
		handlerRef(node);

		rovingProps.ref(node);
	};

	return (
		<div
			aria-label={sub(
				Liferay.Language.get('add-x'),
				audiencesCriteria.label
			)}
			className={classNames(
				'align-items-center audience-builder-attribute c-gap-3 d-flex px-2 rounded',
				{
					'audience-builder-attribute--dragging':
						isDragging || isPlacing,
				}
			)}
			onFocus={rovingProps.onFocus}
			onKeyDown={(event) => {
				handleKeyboardInsert(event);

				if (!event.defaultPrevented) {
					rovingProps.onKeyDown(event);
				}
			}}
			ref={setRefs}
			role="button"
			tabIndex={rovingProps.tabIndex}
		>
			<ClayIcon
				className="audience-builder-attribute__grip text-secondary"
				symbol="drag"
			/>

			<span
				className={classNames(
					'align-items-center audience-builder-attribute__icon d-inline-flex justify-content-center rounded',
					`audience-builder-attribute__icon--${iconColor}`
				)}
			>
				<ClayIcon symbol={audiencesCriteria.icon} />
			</span>

			<span className="text-3 text-truncate">
				{audiencesCriteria.label}
			</span>
		</div>
	);
}

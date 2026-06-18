/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {forwardRef} from 'react';

import {AUDIENCE_ATTRIBUTE} from '../constants/dragTypes';
import useDragSource from '../hooks/useDragSource';

const AttributeItem = forwardRef(
	({active, attribute, onFocus, onPickUp}, ref) => {
		const {handlerRef, isDragging} = useDragSource({
			item: {
				attributeKey: attribute.key,
				icon: attribute.icon,
				name: attribute.label,
				type: AUDIENCE_ATTRIBUTE,
			},
		});

		const handleKeyDown = (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();

				onPickUp(attribute.key);
			}
		};

		const setRefs = (node) => {
			handlerRef(node);

			if (typeof ref === 'function') {
				ref(node);
			}
			else if (ref) {
				ref.current = node;
			}
		};

		return (
			<li
				aria-label={sub(Liferay.Language.get('add-x'), attribute.label)}
				className={classNames('audience-builder-attribute', {
					'audience-builder-attribute-dragging': isDragging,
				})}
				data-attribute-key={attribute.key}
				onFocus={onFocus}
				onKeyDown={handleKeyDown}
				ref={setRefs}
				role="button"
				tabIndex={active ? 0 : -1}
			>
				<span
					aria-hidden="true"
					className="audience-builder-attribute-drag-handle"
				>
					<ClayIcon symbol="drag" />
				</span>

				<ClayIcon
					className="audience-builder-attribute-icon"
					symbol={attribute.icon}
				/>

				<span className="audience-builder-attribute-label">
					{attribute.label}
				</span>
			</li>
		);
	}
);

AttributeItem.displayName = 'AttributeItem';

export default AttributeItem;

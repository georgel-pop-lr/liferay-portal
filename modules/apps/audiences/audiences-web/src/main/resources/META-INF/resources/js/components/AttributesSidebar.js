/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useEffect, useRef, useState} from 'react';

import {useAttributes} from '../AttributesContext';
import AttributeItem from './AttributeItem';

export default function AttributesSidebar({
	onFocusRestored,
	onPickUp,
	pendingFocusKey,
}) {
	const {attributes} = useAttributes();

	const [activeIndex, setActiveIndex] = useState(0);
	const [query, setQuery] = useState('');

	const itemRefs = useRef(new Map());

	const normalizedQuery = query.trim().toLowerCase();

	const filteredAttributes = attributes.filter((attribute) =>
		attribute.label.toLowerCase().includes(normalizedQuery)
	);

	const activeAttributeIndex = Math.min(
		activeIndex,
		Math.max(0, filteredAttributes.length - 1)
	);

	useEffect(() => {
		if (!pendingFocusKey) {
			return;
		}

		const index = filteredAttributes.findIndex(
			(attribute) => attribute.key === pendingFocusKey
		);

		if (index >= 0) {
			setActiveIndex(index);

			itemRefs.current.get(pendingFocusKey)?.focus();
		}

		onFocusRestored();
	}, [filteredAttributes, onFocusRestored, pendingFocusKey]);

	const handleKeyDown = (event) => {
		const count = filteredAttributes.length;

		if (!count) {
			return;
		}

		let index = activeAttributeIndex;

		if (event.key === 'ArrowDown') {
			index = (activeAttributeIndex + 1) % count;
		}
		else if (event.key === 'ArrowUp') {
			index = (activeAttributeIndex - 1 + count) % count;
		}
		else if (event.key === 'End') {
			index = count - 1;
		}
		else if (event.key === 'Home') {
			index = 0;
		}
		else {
			return;
		}

		event.preventDefault();

		setActiveIndex(index);

		itemRefs.current.get(filteredAttributes[index].key)?.focus();
	};

	return (
		<div className="audience-builder-sidebar">
			<h3 className="audience-builder-sidebar-title">
				{Liferay.Language.get('attributes-types')}
			</h3>

			<ClayInput.Group className="audience-builder-sidebar-search">
				<ClayInput.GroupItem>
					<ClayInput
						aria-label={Liferay.Language.get('search-attributes')}
						insetAfter
						onChange={(event) => {
							setQuery(event.target.value);
							setActiveIndex(0);
						}}
						placeholder={Liferay.Language.get('search')}
						type="text"
						value={query}
					/>

					<ClayInput.GroupInsetItem after tag="span">
						<ClayIcon symbol="search" />
					</ClayInput.GroupInsetItem>
				</ClayInput.GroupItem>
			</ClayInput.Group>

			<ul
				aria-label={Liferay.Language.get('attributes-types')}
				aria-orientation="vertical"
				className="audience-builder-attribute-list list-unstyled"
				onKeyDown={handleKeyDown}
				role="toolbar"
			>
				{filteredAttributes.map((attribute, index) => (
					<AttributeItem
						active={index === activeAttributeIndex}
						attribute={attribute}
						key={attribute.key}
						onFocus={() => setActiveIndex(index)}
						onPickUp={onPickUp}
						ref={(node) => {
							if (node) {
								itemRefs.current.set(attribute.key, node);
							}
							else {
								itemRefs.current.delete(attribute.key);
							}
						}}
					/>
				))}
			</ul>
		</div>
	);
}

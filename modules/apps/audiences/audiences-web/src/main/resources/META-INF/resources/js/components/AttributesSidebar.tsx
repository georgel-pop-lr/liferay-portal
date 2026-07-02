/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayForm, {ClaySelectWithOption} from '@clayui/form';
import {SearchForm, useRovingFocus} from '@liferay/layout-js-components-web';
import React, {Dispatch, useState} from 'react';

import {CATEGORY_ICON_COLORS} from '../constants/categoryIconColors';
import {Action} from '../reducer';
import {AudiencesCriteria, AudiencesCriteriaType, Rule} from '../types';
import AttributeListItem from './AttributeListItem';

interface IProps {
	audiencesCriteriaTypes: AudiencesCriteriaType[];
	dispatch: Dispatch<Action>;
	rules: Rule[];
}

export default function AttributesSidebar({
	audiencesCriteriaTypes,
	dispatch,
	rules,
}: IProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [query, setQuery] = useState('');

	const normalizedQuery = query.trim().toLowerCase();

	const audiencesCriterias =
		audiencesCriteriaTypes[selectedIndex]?.audiencesCriterias?.filter(
			(audiencesCriteria) =>
				audiencesCriteria.label.toLowerCase().includes(normalizedQuery)
		) ?? [];

	const {getItemProps} = useRovingFocus({
		itemCount: audiencesCriterias.length,
		loop: true,
	});

	const audiencesCriteriasByKey: Record<string, AudiencesCriteria> =
		Object.fromEntries(
			audiencesCriteriaTypes
				.flatMap(
					(audiencesCriteriaType) =>
						audiencesCriteriaType.audiencesCriterias
				)
				.map((audiencesCriteria) => [
					audiencesCriteria.key,
					audiencesCriteria,
				])
		);

	const dndItems = rules.map((rule) => ({
		id: rule.id,
		name: audiencesCriteriasByKey[rule.attribute]?.label ?? rule.attribute,
	}));

	const handleInsert = (
		audiencesCriteria: AudiencesCriteria,
		index: number
	) => dispatch({audiencesCriteria, index, type: 'ADD_RULE'});

	return (
		<div className="d-flex flex-column flex-grow-0 h-100">
			<p className="h4 my-3">
				{Liferay.Language.get('attributes-types')}
			</p>

			<ClayForm.Group>
				<ClaySelectWithOption
					aria-label={Liferay.Language.get('attributes-types')}
					className="bg-white font-weight-semi-bold text-4"
					onChange={(event) => {
						setSelectedIndex(Number(event.target.value));
						setQuery('');
					}}
					options={audiencesCriteriaTypes.map(
						(audiencesCriteriaType, index) => ({
							label: audiencesCriteriaType.label,
							value: index,
						})
					)}
					value={selectedIndex}
				/>
			</ClayForm.Group>

			<SearchForm
				className="mb-3"
				label={Liferay.Language.get('search-attributes')}
				onChange={setQuery}
			/>

			{audiencesCriterias.length ? (
				<div
					aria-label={Liferay.Language.get('attributes')}
					aria-orientation="vertical"
					className="overflow-auto"
					role="toolbar"
				>
					{audiencesCriterias.map((audiencesCriteria, index) => (
						<AttributeListItem
							audiencesCriteria={audiencesCriteria}
							iconColor={
								CATEGORY_ICON_COLORS[selectedIndex] ??
								CATEGORY_ICON_COLORS[0]
							}
							items={dndItems}
							key={audiencesCriteria.key}
							onInsert={handleInsert}
							rovingProps={getItemProps(index)}
						/>
					))}
				</div>
			) : (
				<ClayEmptyState
					description={Liferay.Language.get(
						'no-attributes-were-found'
					)}
					small
				/>
			)}
		</div>
	);
}

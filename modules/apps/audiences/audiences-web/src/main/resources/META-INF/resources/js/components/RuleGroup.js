/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClaySelect} from '@clayui/form';
import {RowBuilder} from '@liferay/layout-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import RuleRow from './RuleRow';

const CONJUNCTION_LABELS = {
	AND: Liferay.Language.get('and'),
	OR: Liferay.Language.get('or'),
};

const MATCH_LABELS = {
	AND: Liferay.Language.get('all-rules-must-match'),
	OR: Liferay.Language.get('any-rule-must-match'),
};

export default function RuleGroup({
	conjunction,
	insertionIndex = -1,
	onConjunctionChange,
	onReorder,
	onRuleChange,
	onRuleDuplicate,
	onRuleRemove,
	reorderableItems,
	rules,
}) {
	const matchLabel = MATCH_LABELS[conjunction];

	const countLabel = sub(Liferay.Language.get('x-criteria'), rules.length);

	return (
		<div className="audience-builder-rule-group">
			<div className="audience-builder-rule-group-header">
				<ClaySelect
					aria-label={Liferay.Language.get('match-conjunction')}
					className="audience-builder-rule-group-conjunction"
					onChange={(event) =>
						onConjunctionChange(event.target.value)
					}
					value={conjunction}
				>
					<ClaySelect.Option
						label={Liferay.Language.get('and')}
						value="AND"
					/>

					<ClaySelect.Option
						label={Liferay.Language.get('or')}
						value="OR"
					/>
				</ClaySelect>

				<span className="audience-builder-rule-group-summary">
					{`${matchLabel} · ${countLabel}`}
				</span>
			</div>

			<div className="audience-builder-rule-group-body">
				<RowBuilder
					canDelete={() => false}
					createItem={() => ({id: '', name: ''})}
					hideAddButton
					insertionIndex={insertionIndex}
					itemClassName="audience-builder-rule-item"
					items={reorderableItems}
					labels={{
						addedAnnouncement: '',
						delete: Liferay.Language.get('remove'),
						deletedAnnouncement: Liferay.Language.get(
							'a-rule-was-removed-from-the-audience'
						),
						itemAriaLabel: (item) => item.name,
						list: Liferay.Language.get('conditions'),
					}}
					renderItem={({index}) => (
						<RuleRow
							index={index}
							items={reorderableItems}
							onChange={onRuleChange}
							onDuplicate={() => onRuleDuplicate(rules[index].id)}
							onRemove={() => onRuleRemove(rules[index].id)}
							onReorder={onReorder}
							rule={rules[index]}
						/>
					)}
					renderItemSeparator={() => (
						<div className="audience-builder-rule-conjunction">
							{CONJUNCTION_LABELS[conjunction]}
						</div>
					)}
					setItems={onReorder}
				/>
			</div>
		</div>
	);
}

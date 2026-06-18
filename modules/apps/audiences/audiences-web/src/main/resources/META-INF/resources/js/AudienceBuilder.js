/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import {ClayIconSpriteContext} from '@clayui/icon';
import {
	DragAndDropContextProvider,
	DragPreview,
	ScreenReaderAnnouncerContext,
	ScreenReaderAnnouncerContextProvider,
} from '@liferay/layout-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useContext, useMemo, useState} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import AttributesContext, {useAttributes} from './AttributesContext';
import AttributesSidebar from './components/AttributesSidebar';
import ConditionsPanel from './components/ConditionsPanel';
import {clampIndex, insertRuleAt} from './util/rules';
import {nextRuleId, parseAudience, serializeAudience} from './util/serialize';

function AudienceBuilderApp({backURL, initialJSON, initialName, namespace}) {
	const {getAttribute} = useAttributes();

	const {sendMessage} = useContext(ScreenReaderAnnouncerContext);

	const initialAudience = useMemo(
		() => parseAudience(initialJSON),
		[initialJSON]
	);

	const [conjunction, setConjunction] = useState(initialAudience.conjunction);
	const [name, setName] = useState(initialName || '');
	const [pendingFocusKey, setPendingFocusKey] = useState(null);
	const [placement, setPlacement] = useState(null);
	const [rules, setRules] = useState(initialAudience.rules);

	const handleInsert = (attributeKey, index) => {
		const attribute = getAttribute(attributeKey);

		if (!attribute) {
			return;
		}

		setRules((previousRules) =>
			insertRuleAt(
				previousRules,
				{
					attribute: attributeKey,
					id: nextRuleId(),
					operator: attribute.operators[0],
					value: '',
				},
				index
			)
		);

		sendMessage(
			sub(
				Liferay.Language.get('x-was-added-to-the-audience'),
				attribute.label
			)
		);
	};

	const handleReorder = (reorderedItems) =>
		setRules((previousRules) =>
			reorderedItems
				.map(({id}) => previousRules.find((rule) => rule.id === id))
				.filter(Boolean)
		);

	const handlePickUp = (attributeKey) => {
		const attribute = getAttribute(attributeKey);

		if (!attribute) {
			return;
		}

		setPlacement({attributeKey, index: 0});

		sendMessage(sub(Liferay.Language.get('placing-x'), attribute.label));
	};

	const handlePlacementCancel = (restoreFocus) => {
		if (restoreFocus && placement) {
			setPendingFocusKey(placement.attributeKey);
		}

		setPlacement(null);

		sendMessage(Liferay.Language.get('placement-was-canceled'));
	};

	const handlePlacementConfirm = () => {
		if (!placement) {
			return;
		}

		handleInsert(placement.attributeKey, placement.index);

		setPlacement(null);
	};

	const handlePlacementMove = (delta) =>
		setPlacement((previousPlacement) => {
			if (!previousPlacement) {
				return previousPlacement;
			}

			return {
				...previousPlacement,
				index: clampIndex(
					previousPlacement.index + delta,
					rules.length
				),
			};
		});

	const handleRuleChange = (updatedRule) =>
		setRules((previousRules) =>
			previousRules.map((rule) =>
				rule.id === updatedRule.id ? updatedRule : rule
			)
		);

	const handleRuleDuplicate = (id) => {
		const duplicatedRule = rules.find((rule) => rule.id === id);

		if (!duplicatedRule) {
			return;
		}

		setRules((previousRules) => {
			const index = previousRules.findIndex((rule) => rule.id === id);

			const nextRules = [...previousRules];

			nextRules.splice(index + 1, 0, {
				...previousRules[index],
				id: nextRuleId(),
			});

			return nextRules;
		});

		const attribute = getAttribute(duplicatedRule.attribute);

		sendMessage(
			sub(
				Liferay.Language.get('x-was-successfully-duplicated'),
				attribute ? attribute.label : duplicatedRule.attribute
			)
		);
	};

	const handleRuleRemove = (id) => {
		setRules((previousRules) =>
			previousRules.filter((rule) => rule.id !== id)
		);

		sendMessage(
			Liferay.Language.get('a-rule-was-removed-from-the-audience')
		);
	};

	return (
		<div className="audience-builder">
			<input
				name={`${namespace}json`}
				type="hidden"
				value={serializeAudience({
					conjunction,
					rules,
				})}
			/>

			<DragPreview />

			<div className="audience-builder-toolbar">
				<div className="audience-builder-toolbar-start">
					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('back')}
						displayType="unstyled"
						onClick={() => {
							if (backURL) {
								Liferay.Util.navigate(backURL);
							}
						}}
						symbol="angle-left"
					/>

					<span className="audience-builder-toolbar-title">
						{name || Liferay.Language.get('new-audiences')}
					</span>
				</div>

				<div className="audience-builder-toolbar-actions">
					<ClayButton
						displayType="secondary"
						onClick={() => {
							if (backURL) {
								Liferay.Util.navigate(backURL);
							}
						}}
						size="sm"
					>
						{Liferay.Language.get('cancel')}
					</ClayButton>

					<ClayButton displayType="primary" size="sm" type="submit">
						{Liferay.Language.get('save')}
					</ClayButton>
				</div>
			</div>

			<div className="audience-builder-body">
				<div className="audience-builder-name form-group">
					<label htmlFor={`${namespace}name`}>
						{Liferay.Language.get('name')}

						<span className="reference-mark text-warning">
							<span aria-hidden="true">*</span>
						</span>
					</label>

					<ClayInput
						id={`${namespace}name`}
						name={`${namespace}name`}
						onChange={(event) => setName(event.target.value)}
						placeholder={Liferay.Language.get('name')}
						required
						type="text"
						value={name}
					/>
				</div>

				<AttributesSidebar
					onFocusRestored={() => setPendingFocusKey(null)}
					onPickUp={handlePickUp}
					pendingFocusKey={pendingFocusKey}
				/>

				<ConditionsPanel
					conjunction={conjunction}
					onConjunctionChange={setConjunction}
					onInsert={handleInsert}
					onPlacementCancel={handlePlacementCancel}
					onPlacementConfirm={handlePlacementConfirm}
					onPlacementMove={handlePlacementMove}
					onReorder={handleReorder}
					onRuleChange={handleRuleChange}
					onRuleDuplicate={handleRuleDuplicate}
					onRuleRemove={handleRuleRemove}
					placement={placement}
					rules={rules}
				/>
			</div>
		</div>
	);
}

export default function AudienceBuilder({context = {}, props = {}}) {
	const {namespace = '', spritemap} = context;

	const attributesContextValue = useMemo(() => {
		const attributes = (props.audienceCriteriaTypes || []).flatMap(
			(audienceCriteriaType) =>
				audienceCriteriaType.audienceCriterias || []
		);

		const attributesByKey = Object.fromEntries(
			attributes.map((attribute) => [attribute.key, attribute])
		);

		return {
			attributes,
			getAttribute: (key) => attributesByKey[key],
		};
	}, [props.audienceCriteriaTypes]);

	return (
		<ClayIconSpriteContext.Provider
			value={
				spritemap ||
				`${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`
			}
		>
			<AttributesContext.Provider value={attributesContextValue}>
				<DndProvider backend={HTML5Backend}>
					<ScreenReaderAnnouncerContextProvider>
						<DragAndDropContextProvider>
							<AudienceBuilderApp
								backURL={props.backURL}
								initialJSON={props.json}
								initialName={props.name}
								namespace={namespace}
							/>
						</DragAndDropContextProvider>
					</ScreenReaderAnnouncerContextProvider>
				</DndProvider>
			</AttributesContext.Provider>
		</ClayIconSpriteContext.Provider>
	);
}

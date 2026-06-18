/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import {
	RowBuilder,
	ScreenReaderAnnouncerContext,
} from '@liferay/layout-js-components-web';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {useDrop} from 'react-dnd';

import {useAttributes} from '../AttributesContext';
import {AUDIENCE_ATTRIBUTE} from '../constants/dragTypes';
import RuleGroup from './RuleGroup';

export default function ConditionsPanel({
	conjunction,
	onConjunctionChange,
	onInsert,
	onPlacementCancel,
	onPlacementConfirm,
	onPlacementMove,
	onReorder,
	onRuleChange,
	onRuleDuplicate,
	onRuleRemove,
	placement,
	rules,
}) {
	const {getAttribute} = useAttributes();

	const {sendMessage} = useContext(ScreenReaderAnnouncerContext);

	const attributeLabel = useCallback(
		(attributeKey) => {
			const attribute = getAttribute(attributeKey);

			return attribute ? attribute.label : attributeKey;
		},
		[getAttribute]
	);

	const placementLabel = placement
		? attributeLabel(placement.attributeKey)
		: '';

	const reorderableItems = useMemo(
		() =>
			rules.map((rule) => ({
				id: rule.id,
				name: attributeLabel(rule.attribute),
			})),
		[attributeLabel, rules]
	);

	const containerRef = useRef(null);
	const placementRef = useRef(null);
	const scrollDirectionRef = useRef(0);
	const scrollFrameRef = useRef(null);

	const [dropIndex, setDropIndex] = useState(-1);

	const placing = Boolean(placement);
	const placementIndex = placement ? placement.index : -1;

	const startAutoScroll = useCallback((direction) => {
		if (scrollDirectionRef.current === direction) {
			return;
		}

		scrollDirectionRef.current = direction;

		const scrollStep = () => {
			if (containerRef.current && scrollDirectionRef.current !== 0) {
				containerRef.current.scrollTop +=
					scrollDirectionRef.current * 8;

				scrollFrameRef.current = requestAnimationFrame(scrollStep);
			}
		};

		if (scrollFrameRef.current) {
			cancelAnimationFrame(scrollFrameRef.current);
		}

		scrollFrameRef.current = requestAnimationFrame(scrollStep);
	}, []);

	const stopAutoScroll = useCallback(() => {
		scrollDirectionRef.current = 0;

		if (scrollFrameRef.current) {
			cancelAnimationFrame(scrollFrameRef.current);

			scrollFrameRef.current = null;
		}
	}, []);

	useEffect(() => {
		return () => stopAutoScroll();
	}, [stopAutoScroll]);

	useEffect(() => {
		if (placing && placementRef.current) {
			placementRef.current.focus();
		}
	}, [placing]);

	useEffect(() => {
		if (!placing) {
			return;
		}

		const rule = rules[placementIndex];

		if (rule) {
			sendMessage(
				sub(
					Liferay.Language.get('inserting-before-x'),
					attributeLabel(rule.attribute)
				)
			);
		}
		else {
			sendMessage(Liferay.Language.get('inserting-at-the-end'));
		}
	}, [attributeLabel, placing, placementIndex, rules, sendMessage]);

	const handlePlacementKeyDown = (event) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();

			onPlacementMove(1);
		}
		else if (event.key === 'ArrowUp') {
			event.preventDefault();

			onPlacementMove(-1);
		}
		else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();

			onPlacementConfirm();
		}
		else if (event.key === 'Escape') {
			event.preventDefault();

			onPlacementCancel(true);
		}
		else if (event.key === 'Tab') {
			onPlacementCancel(false);
		}
	};

	const getDropIndex = (monitor) => {
		const offset = monitor.getClientOffset();

		if (!offset || !containerRef.current) {
			return rules.length;
		}

		const rowElements = containerRef.current.querySelectorAll(
			'.audience-builder-rule'
		);

		for (let i = 0; i < rowElements.length; i++) {
			const {height, top} = rowElements[i].getBoundingClientRect();

			if (offset.y < top + height / 2) {
				return i;
			}
		}

		return rowElements.length;
	};

	const autoScroll = (monitor) => {
		const offset = monitor.getClientOffset();

		if (!offset || !containerRef.current) {
			stopAutoScroll();

			return;
		}

		const {bottom, top} = containerRef.current.getBoundingClientRect();

		if (offset.y < top + 48) {
			startAutoScroll(-1);
		}
		else if (offset.y > bottom - 48) {
			startAutoScroll(1);
		}
		else {
			stopAutoScroll();
		}
	};

	const [{isOver}, dropRef] = useDrop({
		accept: AUDIENCE_ATTRIBUTE,
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
		drop: (item, monitor) => {
			stopAutoScroll();

			onInsert(item.attributeKey, getDropIndex(monitor));

			setDropIndex(-1);
		},
		hover: (item, monitor) => {
			autoScroll(monitor);

			const index = getDropIndex(monitor);

			setDropIndex((previousIndex) =>
				previousIndex === index ? previousIndex : index
			);
		},
	});

	useEffect(() => {
		if (!isOver) {
			stopAutoScroll();

			setDropIndex(-1);
		}
	}, [isOver, stopAutoScroll]);

	const imagesPath = Liferay.ThemeDisplay.getPathThemeImages();

	const insertionIndex = placing ? placementIndex : isOver ? dropIndex : -1;

	const ruleGroup = (
		<RuleGroup
			conjunction={conjunction}
			insertionIndex={insertionIndex}
			onConjunctionChange={onConjunctionChange}
			onReorder={onReorder}
			onRuleChange={onRuleChange}
			onRuleDuplicate={onRuleDuplicate}
			onRuleRemove={onRuleRemove}
			reorderableItems={reorderableItems}
			rules={rules}
		/>
	);

	const groupsList = (
		<RowBuilder
			canDelete={() => false}
			createItem={() => ({id: '', name: ''})}
			hideAddButton
			itemClassName="audience-builder-group-item"
			items={[{id: 'group-0', name: Liferay.Language.get('group')}]}
			labels={{
				addedAnnouncement: '',
				delete: Liferay.Language.get('remove'),
				deletedAnnouncement: '',
				itemAriaLabel: () => Liferay.Language.get('group'),
				list: Liferay.Language.get('conditions'),
			}}
			renderItem={() => ruleGroup}
			setItems={() => {}}
		/>
	);

	return (
		<div className="audience-builder-conditions card">
			<div className="card-header">
				{Liferay.Language.get('conditions')}
			</div>

			<div
				className={classNames('card-body', {
					'audience-builder-conditions-dragover': isOver,
				})}
				ref={(node) => {
					containerRef.current = node;
					dropRef(node);
				}}
			>
				{placing ? (
					<div
						aria-label={sub(
							Liferay.Language.get('choose-a-position-for-x'),
							placementLabel
						)}
						className="audience-builder-placement"
						onKeyDown={handlePlacementKeyDown}
						ref={placementRef}
						role="application"
						tabIndex={-1}
					>
						{groupsList}
					</div>
				) : rules.length ? (
					groupsList
				) : (
					<div
						aria-live="polite"
						className="audience-builder-empty-state"
						role="status"
					>
						<ClayEmptyState
							description={Liferay.Language.get(
								'to-create-a-new-audience-drag-items-from-the-sidebar-and-drop-them-here'
							)}
							imgSrc={`${imagesPath}/states/empty_state.svg`}
							title={Liferay.Language.get('no-criteria-yet')}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

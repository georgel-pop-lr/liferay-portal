/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {Option, Picker} from '@clayui/core';
import {ClayInput} from '@clayui/form';
import {
	RovingItemProps,
	useDragAndDrop,
} from '@liferay/layout-js-components-web';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';
import {DropTargetMonitor, useDrop} from 'react-dnd';

import {DRAG_TYPES} from '../constants/dragTypes';
import {getOperatorLabel, getOperators} from '../constants/operators';
import {AudiencesCriteria, Rule} from '../types';

type DropPosition = 'bottom' | 'top' | null;

interface DragItem {
	icon: string;
	id: string;
	name: string;
}

interface AttributeDragItem {
	audiencesCriteria: AudiencesCriteria;
	type: string;
}

interface IProps {
	audiencesCriteria?: AudiencesCriteria;
	iconColor: string;
	index: number;
	items: DragItem[];
	onAddRule: (audiencesCriteria: AudiencesCriteria, index?: number) => void;
	onChange: (rule: Rule) => void;
	onDelete: () => void;
	onDuplicate: () => void;
	onNavigate: (delta: number) => void;
	onReorder: (items: DragItem[]) => void;
	rovingProps: RovingItemProps;
	rule: Rule;
}

const getDropPosition = (
	ref: React.RefObject<HTMLElement>,
	monitor: DropTargetMonitor
): DropPosition => {
	const clientOffset = monitor.getClientOffset();

	if (!ref.current || !clientOffset) {
		return null;
	}

	const dropItemBoundingRect = ref.current.getBoundingClientRect();
	const hoverClientY = clientOffset.y - dropItemBoundingRect.top;

	return hoverClientY < dropItemBoundingRect.height / 2 ? 'top' : 'bottom';
};

export default function RuleRow({
	audiencesCriteria,
	iconColor,
	index,
	items,
	onAddRule,
	onChange,
	onDelete,
	onDuplicate,
	onNavigate,
	onReorder,
	rovingProps,
	rule,
}: IProps) {
	const dragHandlerRef = useRef<HTMLButtonElement>(null);
	const dropItemRef = useRef<HTMLDivElement | null>(null);

	const setRowRef = (node: HTMLDivElement | null) => {
		dropItemRef.current = node;

		rovingProps.ref(node);
	};

	const [dropPosition, setDropPosition] = useState<DropPosition>(null);

	const {
		handleKeyboardDragAndDrop,
		isDragging,
		isDropBottomPosition,
		isDropTopPosition,
		isKeyboardDragging,
	} = useDragAndDrop<DragItem>({
		dragHandlerRef,
		dropItemRef,
		item: items[index],
		itemIndex: index,
		items,
		onDrop: onReorder,
	});

	const [{isOver}, attributeDrop] = useDrop<
		AttributeDragItem,
		void,
		{isOver: boolean}
	>({
		accept: DRAG_TYPES.ATTRIBUTE,
		collect: (monitor) => ({isOver: !!monitor.isOver()}),
		drop: (item, monitor) => {
			const dropPosition = getDropPosition(dropItemRef, monitor);

			onAddRule(
				item.audiencesCriteria,
				dropPosition === 'bottom' ? index + 1 : index
			);
		},
		hover: (item, monitor) => {
			let dropPosition: DropPosition = null;

			if (isOver) {
				dropPosition = getDropPosition(dropItemRef, monitor);
			}

			setDropPosition(dropPosition);
		},
	});

	const isNavigationTarget = rovingProps.tabIndex === 0;

	useEffect(() => {
		dropItemRef.current
			?.querySelectorAll<HTMLElement>(
				'a, button, input, select, textarea, [role="combobox"]'
			)
			.forEach((element) => {
				element.tabIndex = isNavigationTarget ? 0 : -1;
			});
	}, [isNavigationTarget]);

	const handleArrowNavigation = (
		event: React.KeyboardEvent<HTMLDivElement>
	) => {
		if (
			isKeyboardDragging ||
			(event.key !== 'ArrowDown' && event.key !== 'ArrowUp')
		) {
			return;
		}

		const target = event.target as HTMLElement;

		if (
			target.getAttribute('role') === 'combobox' ||
			target.tagName === 'INPUT'
		) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		onNavigate(event.key === 'ArrowDown' ? 1 : -1);
	};

	if (!audiencesCriteria) {
		return (
			<div
				aria-label={Liferay.Language.get(
					'the-criteria-is-no-longer-available'
				)}
				className="align-items-center audience-builder-rule audience-builder-rule--error d-flex justify-content-between p-3"
				ref={dropItemRef}
			>
				<div className="align-items-center c-gap-3 d-flex">
					<ClayIcon
						className="text-danger"
						symbol="exclamation-full"
					/>

					<span className="text-3">
						{Liferay.Language.get(
							'the-criteria-is-no-longer-available'
						)}
					</span>
				</div>

				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('delete')}
					borderless
					displayType="secondary"
					onClick={onDelete}
					size="sm"
					symbol="times-circle"
					title={Liferay.Language.get('delete')}
				/>
			</div>
		);
	}

	const {inputType, label, options, type} = audiencesCriteria;

	const operators = getOperators(inputType, type);

	return (
		<div ref={attributeDrop}>
			<div
				aria-label={label}
				className={classNames(
					'align-items-center audience-builder-rule d-flex justify-content-between p-3',
					`audience-builder-rule--${iconColor}`,
					{
						'audience-builder-rule--dragging': isDragging,
						'audience-builder-rule--drop-bottom':
							isDropBottomPosition ||
							(isOver && dropPosition === 'bottom'),
						'audience-builder-rule--drop-top':
							isDropTopPosition ||
							(isOver && dropPosition === 'top'),
					}
				)}
				onFocus={rovingProps.onFocus}
				onKeyDownCapture={handleArrowNavigation}
				ref={setRowRef}
				role="menuitem"
				tabIndex={rovingProps.tabIndex}
			>
				<div className="align-items-center c-gap-3 d-flex">
					<ClayButtonWithIcon
						aria-label={sub(Liferay.Language.get('move-x'), label)}
						borderless
						className="audience-builder-grip text-secondary"
						displayType="secondary"
						onKeyDown={handleKeyboardDragAndDrop}
						ref={dragHandlerRef}
						size="sm"
						symbol="drag"
						title={sub(Liferay.Language.get('move-x'), label)}
					/>

					<span className="font-weight-semi-bold text-4 text-nowrap">
						{label}
					</span>

					<Picker
						aria-label={Liferay.Language.get('operator')}
						className="flex-shrink-0 form-control-sm w-auto"
						items={operators.map((operator) => ({
							label: getOperatorLabel(operator, inputType),
							value: operator,
						}))}
						onSelectionChange={(key) =>
							onChange({...rule, operator: key as string})
						}
						selectedKey={rule.operator}
					>
						{(item) => (
							<Option key={item.value}>{item.label}</Option>
						)}
					</Picker>

					{options.length ? (
						<Picker
							aria-label={Liferay.Language.get('value')}
							className="flex-shrink-0 form-control-sm w-auto"
							items={options}
							onSelectionChange={(key) =>
								onChange({...rule, value: key as string})
							}
							selectedKey={rule.value}
						>
							{(item) => (
								<Option key={item.value}>{item.label}</Option>
							)}
						</Picker>
					) : (
						<ClayInput
							aria-label={Liferay.Language.get('value')}
							className="form-control-sm text-3"
							onChange={(event) =>
								onChange({...rule, value: event.target.value})
							}
							placeholder={
								inputType === 'date' ? 'YYYY-MM-DD' : undefined
							}
							type={type === 'number' ? 'number' : 'text'}
							value={rule.value}
						/>
					)}
				</div>

				<div className="align-items-baseline d-flex">
					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('duplicate')}
						borderless
						displayType="secondary"
						onClick={onDuplicate}
						size="sm"
						symbol="copy"
						title={Liferay.Language.get('duplicate')}
					/>

					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('delete')}
						borderless
						displayType="secondary"
						onClick={onDelete}
						size="sm"
						symbol="times-circle"
						title={Liferay.Language.get('delete')}
					/>
				</div>
			</div>
		</div>
	);
}

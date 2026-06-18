/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import ClayDatePicker from '@clayui/date-picker';
import {ClayInput, ClaySelect} from '@clayui/form';
import {useDragAndDrop} from '@liferay/layout-js-components-web';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {useRef} from 'react';

import {useAttributes} from '../AttributesContext';
import {getOperatorLabel} from '../constants/operators';

function ValueInput({label, onChange, options, type, value}) {
	if (options && options.length) {
		return (
			<ClaySelect
				aria-label={sub(Liferay.Language.get('x-value'), label)}
				onChange={(event) => onChange(event.target.value)}
				value={value || ''}
			>
				{options.map((option) => (
					<ClaySelect.Option
						key={option.value}
						label={option.label}
						value={option.value}
					/>
				))}
			</ClaySelect>
		);
	}

	if (type === 'date') {
		return (
			<ClayDatePicker
				aria-label={sub(Liferay.Language.get('x-value'), label)}
				onChange={onChange}
				placeholder="YYYY-MM-DD"
				value={value || ''}
			/>
		);
	}

	return (
		<ClayInput
			aria-label={sub(Liferay.Language.get('x-value'), label)}
			onChange={(event) => onChange(event.target.value)}
			type={type === 'number' ? 'number' : 'text'}
			value={value || ''}
		/>
	);
}

export default function RuleRow({
	index,
	items,
	onChange,
	onDuplicate,
	onRemove,
	onReorder,
	rule,
}) {
	const {getAttribute} = useAttributes();

	const attribute = getAttribute(rule.attribute);

	const dragHandlerRef = useRef(null);
	const dropItemRef = useRef(null);

	const {
		handleKeyboardDragAndDrop,
		isDragging,
		isDropBottomPosition,
		isDropTopPosition,
		isKeyboardDragging,
	} = useDragAndDrop({
		dragHandlerRef,
		dropItemRef,
		item: items[index],
		itemIndex: index,
		items,
		onDrop: onReorder,
	});

	const handleDragHandleKeyDown = (event) => {
		if (event.key === 'Tab' && isKeyboardDragging) {
			handleKeyboardDragAndDrop({
				key: 'Escape',
				stopPropagation() {},
			});

			return;
		}

		handleKeyboardDragAndDrop(event);
	};

	if (!attribute) {
		return null;
	}

	const label = attribute.label;

	return (
		<div
			className={classNames('audience-builder-rule', {
				'audience-builder-rule-dragging': isDragging,
				'audience-builder-rule-drop-bottom': isDropBottomPosition,
				'audience-builder-rule-drop-top': isDropTopPosition,
			})}
			ref={dropItemRef}
		>
			<span
				className="audience-builder-rule-drag-handle"
				ref={dragHandlerRef}
			>
				<ClayButtonWithIcon
					aria-label={sub(Liferay.Language.get('reorder-x'), label)}
					displayType="unstyled"
					onKeyDown={handleDragHandleKeyDown}
					symbol="drag"
				/>
			</span>

			<span className="audience-builder-rule-attribute">{label}</span>

			<ClaySelect
				aria-label={sub(Liferay.Language.get('x-operator'), label)}
				className="audience-builder-rule-operator"
				onChange={(event) =>
					onChange({...rule, operator: event.target.value})
				}
				value={rule.operator}
			>
				{attribute.operators.map((operator) => (
					<ClaySelect.Option
						key={operator}
						label={getOperatorLabel(operator)}
						value={operator}
					/>
				))}
			</ClaySelect>

			<span className="audience-builder-rule-value">
				<ValueInput
					label={label}
					onChange={(value) => onChange({...rule, value})}
					options={attribute.options}
					type={attribute.type}
					value={rule.value}
				/>
			</span>

			<ClayButtonWithIcon
				aria-label={sub(Liferay.Language.get('duplicate-x'), label)}
				displayType="unstyled"
				onClick={onDuplicate}
				symbol="copy"
			/>

			<ClayButtonWithIcon
				aria-label={sub(Liferay.Language.get('remove-x'), label)}
				displayType="unstyled"
				onClick={onRemove}
				symbol="times-circle"
			/>
		</div>
	);
}

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Rule} from '../types';
import {DragItem} from './types';

export default function buildDndItems(
	rules: Rule[],
	audiencesCriteriasByKey: Record<string, {icon?: string; label: string}>
): DragItem[] {
	return rules.map((rule) => {
		const audiencesCriteria = audiencesCriteriasByKey[rule.attribute];

		return {
			icon: audiencesCriteria?.icon ?? '',
			id: rule.id,
			name: audiencesCriteria?.label ?? rule.attribute,
		};
	});
}

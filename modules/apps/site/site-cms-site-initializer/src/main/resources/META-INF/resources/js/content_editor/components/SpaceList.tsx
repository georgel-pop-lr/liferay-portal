/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import React from 'react';

import {SpaceSticker} from '../../index';

export default function SpaceList({
	displayType,
	name,
	size = 'sm',
}: Pick<
	React.ComponentProps<typeof SpaceSticker>,
	'displayType' | 'name' | 'size'
>) {
	return (
		<div className="align-items-center d-flex">
			<div className="space-list-title">
				<ClayIcon className="text-secondary" symbol="box-container" />

				<span className="mx-2 text-black text-weight-semi-bold">
					{Liferay.Language.get('space')}
				</span>
			</div>

			<div className="mx-4">
				<SpaceSticker
					displayType={displayType}
					name={name}
					size={size}
				/>
			</div>
		</div>
	);
}

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';

interface IProps {
	externalReferenceCode: string;
	namespace: string;
	onExternalReferenceCodeChange: (externalReferenceCode: string) => void;
}

export default function GeneralSettings({
	externalReferenceCode,
	namespace,
	onExternalReferenceCodeChange,
}: IProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="border mt-4 rounded">
			<ClayButton
				aria-expanded={expanded}
				className="align-items-center d-flex justify-content-between px-4 py-3 w-100"
				displayType="unstyled"
				onClick={() => setExpanded((wasExpanded) => !wasExpanded)}
			>
				<span className="font-weight-bold text-6">
					{Liferay.Language.get('general-settings')}
				</span>

				<ClayIcon symbol={expanded ? 'angle-up' : 'angle-down'} />
			</ClayButton>

			{expanded ? (
				<ClayForm.Group className="border-top mb-0 px-4 py-3">
					<label
						className="font-weight-semi-bold text-3"
						htmlFor={`${namespace}externalReferenceCode`}
					>
						{Liferay.Language.get('external-reference-code')}
					</label>

					<ClayInput
						id={`${namespace}externalReferenceCode`}
						name={`${namespace}externalReferenceCode`}
						onChange={(event) =>
							onExternalReferenceCodeChange(event.target.value)
						}
						type="text"
						value={externalReferenceCode}
					/>
				</ClayForm.Group>
			) : null}
		</div>
	);
}

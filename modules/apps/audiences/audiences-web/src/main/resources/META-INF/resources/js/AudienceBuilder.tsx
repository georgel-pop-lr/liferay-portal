/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import ClayLink from '@clayui/link';
import ClayToolbar from '@clayui/toolbar';
import {cancelDebounce, debounce} from 'frontend-js-web';
import React, {useEffect, useRef, useState} from 'react';

import AttributesSidebar from './components/AttributesSidebar';
import {AudiencesCriteriaType} from './types';

const NAME_MAX_LENGTH = 75;

const SIDEBAR_WIDTH = '25%';

interface IProps {
	audiencesCriteriaTypes?: AudiencesCriteriaType[];
	backURL?: string;
	name?: string;
	namespace?: string;
}

export default function AudienceBuilder({
	audiencesCriteriaTypes = [],
	backURL,
	name,
	namespace = '',
}: IProps) {
	const [currentName, setCurrentName] = useState(
		name || Liferay.Language.get('new-audience')
	);
	const [height, setHeight] = useState<string>();

	const editorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const editor = editorRef.current;

		if (!editor) {
			return;
		}

		const updateHeight = () => {
			setHeight(
				`${Math.max(
					0,
					window.innerHeight - editor.getBoundingClientRect().top
				)}px`
			);
		};

		updateHeight();

		const debouncedUpdateHeight = debounce(updateHeight, 100);

		window.addEventListener('resize', debouncedUpdateHeight);

		return () => {
			cancelDebounce(debouncedUpdateHeight);

			window.removeEventListener('resize', debouncedUpdateHeight);
		};
	}, []);

	return (
		<div
			className="d-flex flex-column overflow-hidden"
			ref={editorRef}
			style={{height}}
		>
			<ClayToolbar>
				<ClayLayout.ContainerFluid size={false}>
					<ClayToolbar.Nav>
						<ClayToolbar.Item>
							<ClayLink
								aria-label={Liferay.Language.get('back')}
								button
								displayType="unstyled"
								href={backURL}
								monospaced
							>
								<ClayIcon symbol="angle-left" />
							</ClayLink>
						</ClayToolbar.Item>

						<ClayToolbar.Item expand>
							<ClayToolbar.Section className="text-left">
								<span className="text-truncate">
									{currentName}
								</span>
							</ClayToolbar.Section>
						</ClayToolbar.Item>

						<ClayToolbar.Item>
							<ClayLink
								button
								displayType="secondary"
								href={backURL}
								small
							>
								{Liferay.Language.get('cancel')}
							</ClayLink>
						</ClayToolbar.Item>

						<ClayToolbar.Item>
							<ClayButton
								displayType="primary"
								size="sm"
								type="submit"
							>
								{Liferay.Language.get('save')}
							</ClayButton>
						</ClayToolbar.Item>
					</ClayToolbar.Nav>
				</ClayLayout.ContainerFluid>
			</ClayToolbar>

			<div className="d-flex flex-grow-1 min-h-0">
				<div
					className="border-right d-flex flex-column px-4"
					style={{width: SIDEBAR_WIDTH}}
				>
					<AttributesSidebar
						audiencesCriteriaTypes={audiencesCriteriaTypes}
					/>
				</div>

				<div className="flex-grow-1 min-h-0 overflow-auto p-4">
					<ClayForm.Group>
						<label htmlFor={`${namespace}name`}>
							{Liferay.Language.get('name')}

							<span className="reference-mark">
								<ClayIcon symbol="asterisk" />
							</span>
						</label>

						<ClayInput
							id={`${namespace}name`}
							maxLength={NAME_MAX_LENGTH}
							name={`${namespace}name`}
							onChange={(event) =>
								setCurrentName(event.target.value)
							}
							required
							type="text"
							value={currentName}
						/>
					</ClayForm.Group>
				</div>
			</div>
		</div>
	);
}

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {PageTemplateModalContent} from '@liferay/layout-js-components-web';
import {openToast} from 'frontend-js-components-web';
import {addParams, fetch, navigate} from 'frontend-js-web';
import React from 'react';

type PageTemplateSet = {id: number; name: string};

export type AddLayoutPageTemplateEntryDesignLibraryModalContentProps = {
	addLayoutPageTemplateCollectionURL: string;
	addLayoutPageTemplateEntryURL: string;
	closeModal: () => void;
	mode: 'page-template' | 'set';
	namespace: string;
	pageTemplateSets: Array<PageTemplateSet>;
};

export default function AddLayoutPageTemplateEntryDesignLibraryModalContent({
	addLayoutPageTemplateCollectionURL,
	addLayoutPageTemplateEntryURL,
	closeModal,
	mode,
	namespace,
	pageTemplateSets,
}: AddLayoutPageTemplateEntryDesignLibraryModalContentProps) {
	const submitLayoutPageTemplateEntry = (
		layoutPageTemplateCollectionId: number,
		pageTemplateName?: string
	) => {
		const formData = new FormData();

		formData.append(
			`${namespace}layoutPageTemplateCollectionId`,
			String(layoutPageTemplateCollectionId)
		);

		formData.append(`${namespace}name`, pageTemplateName ?? '');

		fetch(addLayoutPageTemplateEntryURL, {body: formData, method: 'POST'})
			.then((response) => response.json())
			.then(({redirectURL}: {redirectURL?: string}) => {
				if (!redirectURL) {
					navigate(location.href);

					return;
				}

				navigate(
					addParams(
						{[`${namespace}redirect`]: location.href},
						redirectURL
					)
				);
			})
			.catch(() =>
				openToast({
					message: Liferay.Language.get(
						'an-unexpected-error-occurred'
					),
					type: 'danger',
				})
			);
	};

	return (
		<PageTemplateModalContent
			addPageTemplateSetURL={addLayoutPageTemplateCollectionURL}
			allowCustomName={mode === 'page-template'}
			closeModal={closeModal}
			namespace={namespace}
			onSubmitPageTemplateSet={
				mode === 'page-template'
					? submitLayoutPageTemplateEntry
					: () => navigate(location.href)
			}
			pageTemplateSets={mode === 'page-template' ? pageTemplateSets : []}
		/>
	);
}

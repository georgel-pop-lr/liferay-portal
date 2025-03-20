/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openToast} from 'frontend-js-components-web';
import {fetch, sub} from 'frontend-js-web';

import {OverwriteStrategy} from './ImportOptionsModal';

export default function ImportFragments({
	file,
	handleResponse,
	importURL,
	marketplace = false,
	overwriteStrategy,
	portletNamespace,
}: {
	file: File | null;
	handleResponse?: (response: any) => void;
	importURL: string;
	marketplace?: boolean;
	overwriteStrategy?: OverwriteStrategy;
	portletNamespace: string;
}) {
	const formData = new FormData();

	if (!file) {
		console.error('No file provided for import.');

		return;
	}

	formData.append(`${portletNamespace}file`, file);
	formData.append(`${portletNamespace}marketplace`, String(marketplace));

	if (overwriteStrategy) {
		formData.append(`${portletNamespace}importType`, overwriteStrategy);
	}

	fetch(importURL, {
		body: formData,
		method: 'POST',
	})
		.then((response: Response) => response.json())
		.then((response: Response) => {
			handleResponse?.(response);
		})
		.catch(() => {
			openToast({
				message: sub(
					Liferay.Language.get(
						'something-went-wrong-and-the-x-could-not-be-imported'
					),
					file?.name || ''
				),
				type: 'danger',
			});
		});
}

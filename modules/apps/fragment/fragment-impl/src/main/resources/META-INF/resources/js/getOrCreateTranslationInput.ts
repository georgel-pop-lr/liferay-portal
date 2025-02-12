/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default function getOrCreateTranslationInput(
	inputName: string,
	languageId: string,
	localizationInputsContainer: HTMLElement,
	namespace: string,
	inputType: string = 'hidden'
) {
	const inputId = `${namespace}${inputName}_${languageId}`;

	let translationInput = document.getElementById(inputId) as HTMLInputElement;

	if (!translationInput) {
		translationInput = document.createElement('input');
		translationInput.type = inputType;
		translationInput.id = inputId;
		translationInput.name = `${inputName}_${languageId}`;
		translationInput.className = `${inputType}-hidden-input`;
		localizationInputsContainer.appendChild(translationInput);
	}

	return translationInput;
}

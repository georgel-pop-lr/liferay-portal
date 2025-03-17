/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import { ClayRadio, ClayRadioGroup } from '@clayui/form';
import ClayModal, { useModal } from '@clayui/modal';
import React, { useState } from 'react';

const OPTIONS = [
	{
		label: Liferay.Language.get('do-not-import-existing-items'),
		value: 'do_not_import',
	},
	{
		label: Liferay.Language.get('overwrite-existing-items'),
		value: 'overwrite',
	},
	{
		label: Liferay.Language.get('keep-both'),
		value: 'keep_both',
	},
] as const;

export type OverwriteStrategy = (typeof OPTIONS)[number]['value'];

export const DEFAULT_OPTION = OPTIONS[0];

export function ImportOptionsModalContent({
											  onImport,
											  onClose,
											  selectedOption,
	onRadioChange
										  }: {
	onImport: (overwriteStrategy?: OverwriteStrategy) => void;
	onClose: () => void;
	selectedOption: OverwriteStrategy;
	onRadioChange: (value: OverwriteStrategy) => void;
}) {

	return (
		<>
			<ClayModal.Header>
				{Liferay.Language.get('import-options')}
			</ClayModal.Header>

			<ImportOptionsModalBody onRadioChange={onRadioChange} selectedOption={selectedOption}/>
			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton onClick={() => {
							onImport(selectedOption);

							onClose();
						}}>
							{Liferay.Language.get('import')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
}

export function ImportOptionsModalBody({
										   selectedOption,
	onRadioChange
									   }: {
	selectedOption?: OverwriteStrategy;
	onRadioChange: (value: OverwriteStrategy) => void;
}) {
	return (
		<>
			<ClayModal.Body>
				<p className="c-mb-4 text-secondary">
					{Liferay.Language.get(
						'one-or-more-items-from-the-zip-already-exist-in-this-location'
					)}
				</p>

				<ClayRadioGroup
					defaultValue={!selectedOption ? DEFAULT_OPTION.value : selectedOption}
					onChange={(value: string | number) =>
						onRadioChange(value as OverwriteStrategy)
				     }
				>
					{OPTIONS.map((option) => (
						<ClayRadio
							key={option.value}
							label={option.label}
							value={option.value}
						/>
					))}
				</ClayRadioGroup>
			</ClayModal.Body>
		</>
	);
}

function ImportOptionsModal({ onCloseModal, onImport }: {
	onCloseModal: () => void;
	onImport: (overwriteStrategy?: OverwriteStrategy) => void;
}) {
	const [selectedOption, setSelectedOption] = useState<OverwriteStrategy>(
		DEFAULT_OPTION.value
	);

	const { observer, onClose } = useModal({
		onClose: onCloseModal,
	});

	return (
		<ClayModal observer={observer}>
			<ImportOptionsModalContent
				onClose={onClose}
				onImport={onImport}
				selectedOption={selectedOption}
				onRadioChange={(value: OverwriteStrategy) =>
					setSelectedOption(value as OverwriteStrategy)
				}
			/>
		</ClayModal>
	);
}

export default ImportOptionsModal;
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {navigate} from 'frontend-js-web';
import React from 'react';

import {Import} from '../../../src/main/resources/META-INF/resources/js';
import importZipFile from '../../../src/main/resources/META-INF/resources/js/components/import/importZipFile';
import FragmentSetModal from '../../../src/main/resources/META-INF/resources/js/components/modals/FragmentSetModal';
import openModalComponent from '../../../src/main/resources/META-INF/resources/js/components/modals/openModalComponent';

jest.mock('frontend-js-web', () => ({
	...jest.requireActual('frontend-js-web'),
	fetch: () => Promise.resolve({json: () => ({hasConflicts: true})}),
	navigate: jest.fn(),
}));

jest.mock(
	'../../../src/main/resources/META-INF/resources/js/components/import/importZipFile',
	() => jest.fn(() => Promise.resolve())
);

jest.mock(
	'../../../src/main/resources/META-INF/resources/js/components/modals/openModalComponent'
);

function renderComponent({
	addFragmentCollectionURL = '/o/test/add_fragment_collection',
	backURL = 'backURL',
	fragmentCollectionId,
	fragmentCollections = [{fragmentCollectionId: 1, name: 'Set Name'}],
	helpLink,
	importURL = 'importURL',
	portletNamespace = 'namespace',
} = {}) {
	return render(
		<Import
			addFragmentCollectionURL={addFragmentCollectionURL}
			backURL={backURL}
			fragmentCollectionId={fragmentCollectionId}
			fragmentCollections={fragmentCollections}
			helpLink={helpLink}
			importURL={importURL}
			portletNamespace={portletNamespace}
		/>
	);
}

describe('Import', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders text informing the user should upload a ZIP file', async () => {
		const {findByText} = renderComponent();

		expect(
			await findByText(
				'select-a-zip-file-containing-one-or-multiple-entries'
			)
		).toBeInTheDocument();
	});

	it('renders file input', async () => {
		const {findByLabelText} = renderComponent();

		expect(await findByLabelText('file-upload')).toBeInTheDocument();
	});

	it('renders submit button disabled until file input has a valid value', async () => {
		const {findByLabelText, findByRole} = renderComponent();

		const button = await findByRole('button', {name: /import/i});

		expect(button).toBeDisabled();

		const file = new File(['(⌐□_□)'], 'example.zip', {
			type: 'application/zip',
		});

		await userEvent.upload(await findByLabelText('file-upload'), file);

		expect(button).not.toBeDisabled();
	});

	it('renders cancel button enabled', async () => {
		const {findByRole} = renderComponent({backURL: 'http://test.com'});

		const button = await findByRole('button', {name: /cancel/i});

		expect(button).not.toBeDisabled();

		await userEvent.click(button);

		expect(navigate).toHaveBeenCalled();
	});

	it('shows required validation when a file with an invalid extension is introduced', async () => {
		const {findByLabelText, findByRole, findByText} = renderComponent();

		const button = await findByRole('button', {name: /import/i});

		const file = new File(['(⌐□_□)'], 'example.png', {
			type: 'image/png',
		});

		fireEvent.change(await findByLabelText('file-upload'), {
			target: {files: [file]},
		});

		expect(button).toBeDisabled();
		expect(
			await findByText('only-zip-files-are-allowed')
		).toBeInTheDocument();
	});

	it('renders help link', async () => {
		const {findByText} = renderComponent({
			helpLink: {href: 'http://example.com', message: 'Learn more'},
		});

		expect(await findByText('Learn more')).toBeInTheDocument();
	});

	it('opens fragment set modal for single fragment imports', async () => {
		importZipFile.mockImplementation(({handleResponse}) => {
			handleResponse(
				{
					hasConflicts: false,
					importResults: {},
					needsFragmentCollection: true,
				},
				new File(['(⌐□_□)'], 'example.zip', {
					type: 'application/zip',
				})
			);

			return Promise.resolve();
		});

		const {findByLabelText, findByRole} = renderComponent();

		const file = new File(['(⌐□_□)'], 'example.zip', {
			type: 'application/zip',
		});

		await userEvent.upload(await findByLabelText('file-upload'), file);
		await userEvent.click(await findByRole('button', {name: /import/i}));

		expect(openModalComponent).toHaveBeenCalledWith(
			expect.objectContaining({
				ModalComponent: FragmentSetModal,
			})
		);
	});

	it('retries import with selected fragment collection after fragment set modal submission', async () => {
		importZipFile.mockImplementation(
			({fragmentCollectionId, handleResponse}) => {
				handleResponse(
					{
						hasConflicts: false,
						importResults:
							fragmentCollectionId === 1
								? {'fragment-id': 'Fragment Name'}
								: {},
						needsFragmentCollection: fragmentCollectionId !== 1,
					},
					new File(['(⌐□_□)'], 'example.zip', {
						type: 'application/zip',
					})
				);

				return Promise.resolve();
			}
		);

		const {findByLabelText, findByRole} = renderComponent();

		const file = new File(['(⌐□_□)'], 'example.zip', {
			type: 'application/zip',
		});

		await userEvent.upload(await findByLabelText('file-upload'), file);
		await userEvent.click(await findByRole('button', {name: /import/i}));

		const {modalComponentProps} = openModalComponent.mock.calls[0][0];

		await modalComponentProps.onSubmitFragmentCollection(1);

		await waitFor(() => {
			expect(importZipFile).toHaveBeenLastCalledWith(
				expect.objectContaining({
					fragmentCollectionId: 1,
				})
			);
		});
	});

	it('does not open fragment set modal when the import view already has a selected collection', async () => {
		importZipFile.mockImplementation(({handleResponse}) => {
			handleResponse(
				{
					hasConflicts: false,
					importResults: {'fragment-id': 'Fragment Name'},
					needsFragmentCollection: false,
				},
				new File(['(⌐□_□)'], 'example.zip', {
					type: 'application/zip',
				})
			);

			return Promise.resolve();
		});

		const {findByLabelText, findByRole} = renderComponent({
			fragmentCollectionId: 1,
		});

		const file = new File(['(⌐□_□)'], 'example.zip', {
			type: 'application/zip',
		});

		await userEvent.upload(await findByLabelText('file-upload'), file);
		await userEvent.click(await findByRole('button', {name: /import/i}));

		expect(openModalComponent).not.toHaveBeenCalled();
		expect(importZipFile).toHaveBeenCalledWith(
			expect.objectContaining({
				fragmentCollectionId: 1,
			})
		);
	});
});

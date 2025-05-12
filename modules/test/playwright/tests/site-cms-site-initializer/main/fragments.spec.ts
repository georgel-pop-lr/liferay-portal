/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../../fixtures/apiHelpersTest';
import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {loginTest} from '../../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../../fixtures/pageEditorPagesTest';
import {clickAndExpectToBeVisible} from '../../../utils/clickAndExpectToBeVisible';
import {cmsPagesTest} from './fixtures/cmsPagesTest';

const test = mergeTests(
	apiHelpersTest,
	cmsPagesTest,
	loginTest(),
	pageEditorPagesTest,
	dataApiHelpersTest
);

test.describe('Space List Fragment CMS', () => {
	test(
		'Check the functionality of the Space List fragment CMS',
		{tag: ['@LPD-52223']},
		async ({contentsPage, page, pageEditorPage, structuresPage}) => {

			// Go to the Structures Pages

			await structuresPage.goto();

			const basicWebContentRow = page.getByRole('row', {
				name: 'Basic Web Content',
			});

			// Edit Basic Web Content structure

			await clickAndExpectToBeVisible({
				autoClick: true,
				target: page.getByRole('menuitem', {name: 'Edit'}),
				trigger: basicWebContentRow.locator('.dropdown-toggle', {
					hasText: 'Actions',
				}),
			});

			// Customize Experience adds Space List fragment

			await page
				.getByRole('button', {
					exact: true,
					name: 'Customize Experience',
				})
				.click();

			const spaceListFragment = page.locator('.space-list-fragment');

			let isSpaceListVisible = false;

			try {
				await page.locator('.page-editor').waitFor();
				await spaceListFragment.waitFor({timeout: 2000});
				isSpaceListVisible = true;
			}
			catch {}

			if (!isSpaceListVisible) {
				await pageEditorPage.addFragment(
					'fragment.collection.label.space-list',
					'space-list'
				);
				await pageEditorPage.publishPage();
			}

			// Go to add new content

			await contentsPage.goto();
			await contentsPage.createContent('Basic Web Content');

			// Check the default Space List fragment configuration

			await expect(spaceListFragment).toBeVisible();
			await expect(page.locator('.space-list-title-text')).toHaveText(
				'Space'
			);
			await expect(
				page.locator('.space-list-name .sticker-overlay')
			).toHaveText('D');
			await expect(
				page.locator('.space-list-name span').last()
			).toHaveText('Default');
		}
	);
});

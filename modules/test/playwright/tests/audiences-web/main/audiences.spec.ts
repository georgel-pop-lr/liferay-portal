/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../../fixtures/apiHelpersTest';
import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {isolatedSiteTest} from '../../../fixtures/isolatedSiteTest';
import {loginTest} from '../../../fixtures/loginTest';
import {clickAndExpectToBeVisible} from '../../../utils/clickAndExpectToBeVisible';
import dragAndDropElement from '../../../utils/dragAndDropElement';
import getRandomString from '../../../utils/getRandomString';
import {PORTLET_URLS} from '../../../utils/portletUrls';
import {waitForAlert} from '../../../utils/waitForAlert';

const test = mergeTests(
	apiHelpersTest,
	dataApiHelpersTest,
	featureFlagsTest({
		'LPD-93951': {enabled: true},
	}),
	isolatedSiteTest,
	loginTest()
);

test(
	'Can create, edit and delete an audience with a browser name condition',
	{
		tag: '@LPD-93951',
	},
	async ({page, site}) => {
		await page.goto(
			`/group${site.friendlyUrlPath}${PORTLET_URLS.audiences}`
		);

		// Create a new audience

		await page.getByRole('button', {name: 'New Audience'}).first().click();

		const audienceName = 'Audience ' + getRandomString();

		await page.getByPlaceholder('New Audience').fill(audienceName);

		// Add the Browser Name condition and fill in its value

		await dragAndDropElement({
			dragTarget: page
				.locator('.audience-builder-attribute')
				.filter({hasText: 'Browser Name'}),
			dropTarget: page.locator('.audience-builder-drop-zone'),
		});

		await page.getByLabel('Value').fill('Chrome');

		await page.getByRole('button', {name: 'Save'}).click();

		await waitForAlert(page);

		// The audience is listed

		await expect(
			page.locator('tr').filter({hasText: audienceName})
		).toBeVisible();

		// Reopen it and check the values were kept

		await clickAndExpectToBeVisible({
			autoClick: true,
			target: page.getByRole('menuitem', {name: 'Edit'}),
			trigger: page
				.locator('tr')
				.filter({hasText: audienceName})
				.locator('button.dropdown-toggle'),
		});

		await expect(page.getByPlaceholder('New Audience')).toHaveValue(
			audienceName
		);
		await expect(
			page.locator('.audience-builder-rule').getByText('Browser Name')
		).toBeVisible();
		await expect(page.getByLabel('Value')).toHaveValue('Chrome');

		// Go back to the list

		await page.getByRole('link', {exact: true, name: 'Back'}).click();

		// Delete the audience and check it is no longer listed

		page.once('dialog', (dialog) => dialog.accept());

		await clickAndExpectToBeVisible({
			autoClick: true,
			target: page.getByRole('menuitem', {name: 'Delete'}),
			trigger: page
				.locator('tr')
				.filter({hasText: audienceName})
				.locator('button.dropdown-toggle'),
		});

		await waitForAlert(page);

		await expect(
			page.locator('tr').filter({hasText: audienceName})
		).toHaveCount(0);
	}
);

test(
	'Builds and clears conditions from the keyboard and filters by type',
	{
		tag: '@LPD-94450',
	},
	async ({page, site}) => {
		await page.goto(
			`/group${site.friendlyUrlPath}${PORTLET_URLS.audiences}`
		);

		await page.getByRole('button', {name: 'New Audience'}).first().click();

		// A new audience starts with an empty conditions state

		await expect(page.getByText('No Criteria Yet')).toBeVisible();
		await expect(
			page.getByText(
				'To create a new audience, drag items from the sidebar and drop them here.'
			)
		).toBeVisible();

		// Enter on an attribute inserts it as the first condition

		await page
			.getByRole('button', {name: 'Add Browser Name'})
			.press('Enter');

		await expect(
			page.locator('.audience-builder-rule').getByText('Browser Name')
		).toBeVisible();

		await page.getByLabel('Value').fill('Chrome');

		await expect(page.getByText('All Rules Must Match')).toBeVisible();
		await expect(page.getByText('1 Criterion')).toBeVisible();

		// Enter picks a second attribute up, a second Enter drops it below

		const addBrowserVersion = page.getByRole('button', {
			name: 'Add Browser Version',
		});

		await addBrowserVersion.press('Enter');

		await expect(addBrowserVersion).toHaveClass(
			/audience-builder-attribute--dragging/
		);

		await addBrowserVersion.press('Enter');

		await expect(page.locator('.audience-builder-rule')).toHaveCount(2);
		await expect(page.getByText('2 Criteria')).toBeVisible();

		// Removing the conditions returns to the empty state

		await page
			.locator('.audience-builder-rule')
			.filter({hasText: 'Browser Version'})
			.getByLabel('Delete')
			.click();

		await expect(page.locator('.audience-builder-rule')).toHaveCount(1);

		await page.getByLabel('Delete').click();

		await expect(page.getByText('No Criteria Yet')).toBeVisible();

		// The type selector filters the attribute list by category

		const typeSelector = page.getByLabel('Attributes Types');

		await typeSelector.selectOption({label: 'General'});

		await expect(
			page
				.locator('.audience-builder-attribute')
				.filter({hasText: 'User Authentication'})
		).toBeVisible();
		await expect(
			page
				.locator('.audience-builder-attribute')
				.filter({hasText: 'Browser Name'})
		).toHaveCount(0);

		await typeSelector.selectOption({label: 'Browser Attributes'});

		await expect(
			page
				.locator('.audience-builder-attribute')
				.filter({hasText: 'Browser Name'})
		).toBeVisible();
	}
);

test(
	'Shows a collapsible General Settings section with an external reference code field',
	{
		tag: '@LPD-95291',
	},
	async ({page, site}) => {
		await page.goto(
			`/group${site.friendlyUrlPath}${PORTLET_URLS.audiences}`
		);

		await page.getByRole('button', {name: 'New Audience'}).first().click();

		const generalSettingsToggle = page.getByRole('button', {
			name: 'General Settings',
		});

		// The section is collapsed by default

		await expect(generalSettingsToggle).toHaveAttribute(
			'aria-expanded',
			'false'
		);
		await expect(page.getByLabel('External Reference Code')).toHaveCount(0);

		// It expands on interaction and exposes an editable field

		await generalSettingsToggle.click();

		await expect(generalSettingsToggle).toHaveAttribute(
			'aria-expanded',
			'true'
		);

		const externalReferenceCode = page.getByLabel(
			'External Reference Code'
		);

		await externalReferenceCode.fill('ERC-123');

		await expect(externalReferenceCode).toHaveValue('ERC-123');

		// It collapses again on interaction

		await generalSettingsToggle.click();

		await expect(page.getByLabel('External Reference Code')).toHaveCount(0);
	}
);

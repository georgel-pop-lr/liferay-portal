/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {analyticsCloudConnectionTest} from '../../../fixtures/analyticsCloudConnectionTest';
import {apiHelpersTest} from '../../../fixtures/apiHelpersTest';
import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {isolatedSiteTest} from '../../../fixtures/isolatedSiteTest';
import {loginTest} from '../../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../../fixtures/pageEditorPagesTest';
import getRandomString from '../../../utils/getRandomString';
import {performUserSwitchViaApi, userData} from '../../../utils/performLogin';
import {waitForAlert} from '../../../utils/waitForAlert';

const SEGMENTS_EXPERIENCES_URL =
	'/api/jsonws/segments.segmentsexperience/get-segments-experiences';

const test = mergeTests(
	analyticsCloudConnectionTest,
	apiHelpersTest,
	featureFlagsTest({
		'LPD-65399': {enabled: true},
		'LPD-78863': {enabled: true, system: true},
		'LPD-81914': {enabled: true},
		'LPS-155284': {enabled: true},
	}),
	isolatedSiteTest,
	loginTest(),
	pageEditorPagesTest
);

test(
	'Emits the default and matched segment experience keys on a content page',
	{
		tag: '@LPD-93663',
	},
	async ({apiHelpers, page, pageEditorPage, site}) => {

		// Create a user and a matching segment

		const user = await apiHelpers.headlessAdminUser.postUserAccount();

		userData[user.alternateName] = {
			name: user.givenName,
			password: 'test',
			surname: user.familyName,
		};

		const segmentName = getRandomString();

		await apiHelpers.jsonWebServicesSegmentsEntry.addSegmentsEntry({
			criteria: {
				criteria: {
					user: {
						conjunction: 'and',
						filterString: `(emailAddress eq '${user.emailAddress}')`,
						typeValue: 'model',
					},
				},
				filterString: {
					model: `(emailAddress eq '${user.emailAddress}')`,
				},
			},
			groupId: site.id,
			name: segmentName,
		});

		// Create a content page with a prioritized experience for the segment

		const layout = await apiHelpers.headlessDelivery.createSitePage({
			siteId: site.id,
			title: getRandomString(),
		});

		await pageEditorPage.goto(layout, site.friendlyUrlPath);

		const experienceName = getRandomString();

		await pageEditorPage.createExperience(experienceName);

		await pageEditorPage.editExperienceSegment(experienceName, segmentName);

		await waitForAlert(
			page,
			'Success:The experience was updated successfully.'
		);

		await pageEditorPage.openExperienceSelector();

		await page
			.locator('.dropdown-menu__experience', {hasText: experienceName})
			.getByLabel('Prioritize Experience', {exact: true})
			.click();

		await pageEditorPage.closeExperienceSelector();

		await pageEditorPage.publishPage();

		// The admin does not match the segment, so the default key is reported

		await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

		const metaLocator = page.locator('meta[name="page-experience-key"]');

		await expect(metaLocator).toHaveCount(1);

		await expect(metaLocator).toHaveAttribute('content', 'DEFAULT');

		// Get the experience key

		const urlSearchParams = new URLSearchParams();

		urlSearchParams.append('active', 'true');
		urlSearchParams.append('groupId', site.id);
		urlSearchParams.append('plid', layout.id);

		const segmentsExperiences = await apiHelpers.post(
			SEGMENTS_EXPERIENCES_URL,
			{
				data: urlSearchParams.toString(),
				failOnStatusCode: true,
				headers: await apiHelpers.getJSONWebServicesHeaders(),
			}
		);

		const segmentsExperience = segmentsExperiences.find(
			(experience: {segmentsExperienceKey: string}) =>
				experience.segmentsExperienceKey !== 'DEFAULT'
		);

		// View the page as the segment-matching user

		await performUserSwitchViaApi(page, user.alternateName);

		await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

		await expect(metaLocator).toHaveCount(1);

		await expect(metaLocator).toHaveAttribute(
			'content',
			segmentsExperience.segmentsExperienceKey
		);

		// Switch back to the admin so cleanup runs with the right permissions

		await performUserSwitchViaApi(page, 'test');
	}
);

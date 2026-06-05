/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {mergeTests} from '@playwright/test';

import {apiHelpersTest} from './apiHelpersTest';
import {featureFlagsTest} from './featureFlagsTest';
import {loginTest} from './loginTest';

const ANALYTICS_CONFIGURATION_PID =
	'com.liferay.analytics.settings.configuration.AnalyticsConfiguration';

const ANALYTICS_CONFIGURATION_URL = `/o/headless-admin-configuration/v1.0/instance-configurations/${ANALYTICS_CONFIGURATION_PID}`;

const test = mergeTests(apiHelpersTest, featureFlagsTest({}), loginTest());

/**
 * Stubs the Analytics Cloud connection so the analytics client initializes and
 * emits events without reaching a real backend, then restores the original
 * configuration when the test finishes, whether it passed or failed.
 */
const analyticsCloudConnectionTest = test.extend<{
	analyticsCloudConnection: void;
}>({
	analyticsCloudConnection: [
		async ({apiHelpers, featureFlags, login}, use) => {

			// Run after the feature flags and login are in place

			void featureFlags;
			void login;

			const configuration = await apiHelpers.get(
				ANALYTICS_CONFIGURATION_URL
			);

			const originalAnalyticsProperties = configuration?.properties ?? {};

			try {
				await apiHelpers.put(ANALYTICS_CONFIGURATION_URL, {
					data: {
						externalReferenceCode: ANALYTICS_CONFIGURATION_PID,
						properties: {
							liferayAnalyticsDataSourceId:
								'playwright-stub-data-source',
							liferayAnalyticsFaroBackendSecuritySignature:
								'playwright-stub-signature',
							liferayAnalyticsFaroBackendURL:
								'http://playwright-stub.invalid',
						},
					},
					failOnStatusCode: true,
				});

				await use();
			}
			finally {

				// Restore only a prior configuration; the endpoint rejects an
				// empty-properties restore

				if (Object.keys(originalAnalyticsProperties).length) {
					await apiHelpers.put(ANALYTICS_CONFIGURATION_URL, {
						data: {
							externalReferenceCode: ANALYTICS_CONFIGURATION_PID,
							properties: originalAnalyticsProperties,
						},
						failOnStatusCode: true,
					});
				}
			}
		},
		{auto: true},
	],
});

export {analyticsCloudConnectionTest};

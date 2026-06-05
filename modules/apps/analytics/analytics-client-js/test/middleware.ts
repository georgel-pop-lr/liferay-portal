/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

// @ts-ignore - Check possibility to install package in ts format

import fetchMock from 'fetch-mock';

import AnalyticsClient from '../src/analytics';
import {meta} from '../src/middlewares/meta';
import {Analytics} from '../src/types';
import {INITIAL_ANALYTICS_CONFIG, sendDummyEvents, wait} from './helpers';

const FLUSH_INTERVAL = 100;

const INITIAL_CONFIG = {
	...INITIAL_ANALYTICS_CONFIG,
	endpointUrl: 'https://ac-server.io',
	flushInterval: FLUSH_INTERVAL,
};

describe('Analytics MiddleWare Integration', () => {
	let Analytics: AnalyticsClient;

	beforeEach(() => {
		fetchMock.mock('*', () => 200);

		Analytics = AnalyticsClient.create(INITIAL_CONFIG);
	});

	afterEach(() => {
		Analytics.reset();
		AnalyticsClient.dispose();

		fetchMock.restore();
	});

	describe('registerMiddleware()', () => {
		it('is exposed as an Analytics static method', () => {
			expect(typeof Analytics.registerMiddleware).toBe('function');
		});

		it('processes the given middleware', async () => {
			const middleware = jest.fn((req, _analytics) => {
				return req;
			});

			Analytics.registerMiddleware(
				middleware as unknown as Analytics.Middleware
			);

			sendDummyEvents(Analytics);

			await wait(FLUSH_INTERVAL * 2);

			expect(middleware).toHaveBeenCalledWith(
				expect.objectContaining({context: expect.anything()})
			);
		});
	});

	describe('default middlewares', () => {
		it('includes document metadata by default', () => {
			const req = {context: {channelId: '', dataSourceId: ''}};

			expect(meta(req).context).toEqual(
				expect.objectContaining({
					canonicalUrl: expect.anything(),
					contentLanguageId: expect.anything(),
					description: expect.anything(),
					keywords: expect.anything(),
					languageId: expect.anything(),
					referrer: expect.anything(),
					timezoneOffset: expect.anything(),
					title: expect.anything(),
					url: expect.anything(),
					userAgent: expect.anything(),
				})
			);
		});

		it('includes an empty page experience key when the meta tag is absent', () => {
			const req = {context: {channelId: '', dataSourceId: ''}};

			expect(meta(req).context).toEqual(
				expect.objectContaining({pageExperienceKey: ''})
			);
		});

		it('includes the page experience key when the meta tag is present', () => {
			const metaElement = document.createElement('meta');

			metaElement.setAttribute('content', 'TEST_EXPERIENCE_KEY');
			metaElement.setAttribute('name', 'page-experience-key');

			document.head.appendChild(metaElement);

			const req = {context: {channelId: '', dataSourceId: ''}};

			expect(meta(req).context).toEqual(
				expect.objectContaining({
					pageExperienceKey: 'TEST_EXPERIENCE_KEY',
				})
			);

			document.head.removeChild(metaElement);
		});
	});
});

/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.admin.site.internal.resource.v1_0;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.util.Constants;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

/**
 * @author Georgel Pop
 */
public class SitePageResourceImplTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Test
	@TestInfo("LPD-87641")
	public void testIsPublishCommand() {
		SitePageResourceImpl sitePageResourceImpl = new SitePageResourceImpl();

		for (String command :
				new String[] {
					Constants.PUBLISH_TO_LIVE, Constants.PUBLISH_TO_REMOTE,
					Constants.SCHEDULE_PUBLISH_TO_LIVE,
					Constants.SCHEDULE_PUBLISH_TO_REMOTE
				}) {

			ReflectionTestUtil.setFieldValue(
				sitePageResourceImpl, "_command", command);

			Assert.assertTrue(
				command,
				ReflectionTestUtil.invoke(
					sitePageResourceImpl, "_isPublishCommand",
					new Class<?>[0]));
		}

		for (String command :
				new String[] {
					Constants.COPY_FROM_LIVE, Constants.SCHEDULE_COPY_FROM_LIVE,
					StringPool.BLANK
				}) {

			ReflectionTestUtil.setFieldValue(
				sitePageResourceImpl, "_command", command);

			Assert.assertFalse(
				command,
				ReflectionTestUtil.invoke(
					sitePageResourceImpl, "_isPublishCommand",
					new Class<?>[0]));
		}
	}

}
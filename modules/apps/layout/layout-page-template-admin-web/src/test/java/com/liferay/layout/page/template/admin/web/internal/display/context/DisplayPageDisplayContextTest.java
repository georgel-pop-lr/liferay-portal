/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.page.template.admin.web.internal.display.context;

import com.liferay.info.item.InfoItemServiceRegistry;
import com.liferay.layout.page.template.admin.web.internal.constants.LayoutPageTemplateAdminWebKeys;
import com.liferay.layout.page.template.constants.LayoutPageTemplateConstants;
import com.liferay.portal.kernel.portlet.LiferayPortletRequest;
import com.liferay.portal.kernel.portlet.LiferayPortletResponse;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.Mockito;

/**
 * @author Georgel Pop
 */
public class DisplayPageDisplayContextTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Test
	@TestInfo("LPD-104842")
	public void testGetLayoutPageTemplateCollectionId() {
		long layoutPageTemplateCollectionId = RandomTestUtil.randomLong();

		_testGetLayoutPageTemplateCollectionId(
			layoutPageTemplateCollectionId, layoutPageTemplateCollectionId);

		_testGetLayoutPageTemplateCollectionId(
			LayoutPageTemplateConstants.
				PARENT_LAYOUT_PAGE_TEMPLATE_COLLECTION_ID_DEFAULT,
			null);
	}

	private void _testGetLayoutPageTemplateCollectionId(
		long expectedLayoutPageTemplateCollectionId,
		Long layoutPageTemplateCollectionId) {

		HttpServletRequest httpServletRequest = Mockito.mock(
			HttpServletRequest.class);

		Mockito.when(
			httpServletRequest.getAttribute(
				LayoutPageTemplateAdminWebKeys.
					LAYOUT_PAGE_TEMPLATE_COLLECTION_ID)
		).thenReturn(
			layoutPageTemplateCollectionId
		);

		DisplayPageDisplayContext displayPageDisplayContext =
			new DisplayPageDisplayContext(
				httpServletRequest, _infoItemServiceRegistry,
				_liferayPortletRequest, _liferayPortletResponse);

		Assert.assertEquals(
			expectedLayoutPageTemplateCollectionId,
			displayPageDisplayContext.getLayoutPageTemplateCollectionId());
	}

	private final InfoItemServiceRegistry _infoItemServiceRegistry =
		Mockito.mock(InfoItemServiceRegistry.class);
	private final LiferayPortletRequest _liferayPortletRequest = Mockito.mock(
		LiferayPortletRequest.class);
	private final LiferayPortletResponse _liferayPortletResponse = Mockito.mock(
		LiferayPortletResponse.class);

}
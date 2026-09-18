/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.page.template.admin.web.internal.design.library.resource.type;

import com.liferay.depot.model.DepotEntry;
import com.liferay.layout.page.template.constants.LayoutPageTemplateActionKeys;
import com.liferay.layout.page.template.constants.LayoutPageTemplateCollectionTypeConstants;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.resource.PortletResourcePermission;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.Mockito;

/**
 * @author Georgel Pop
 */
public class DisplayPageTemplateFolderDesignLibraryResourceTypeContributorTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Before
	public void setUp() {
		Mockito.when(
			_depotEntry.getGroupId()
		).thenReturn(
			_GROUP_ID
		);

		ReflectionTestUtil.setFieldValue(
			_displayPageTemplateFolderDesignLibraryResourceTypeContributor,
			"_portletResourcePermission", _portletResourcePermission);
	}

	@Test
	@TestInfo("LPD-104842")
	public void testGetType() {
		Assert.assertEquals(
			String.valueOf(
				LayoutPageTemplateCollectionTypeConstants.DISPLAY_PAGE),
			_displayPageTemplateFolderDesignLibraryResourceTypeContributor.
				getType());
	}

	@Test
	@TestInfo("LPD-104842")
	public void testHasAddPermission() {
		Assert.assertFalse(
			_displayPageTemplateFolderDesignLibraryResourceTypeContributor.
				hasAddPermission(_permissionChecker, _depotEntry));

		Mockito.when(
			_portletResourcePermission.contains(
				_permissionChecker, _GROUP_ID,
				LayoutPageTemplateActionKeys.
					ADD_LAYOUT_PAGE_TEMPLATE_COLLECTION)
		).thenReturn(
			true
		);

		Assert.assertTrue(
			_displayPageTemplateFolderDesignLibraryResourceTypeContributor.
				hasAddPermission(_permissionChecker, _depotEntry));
	}

	@Test
	@TestInfo("LPD-104842")
	public void testHasViewPermission() {
		Assert.assertFalse(
			_displayPageTemplateFolderDesignLibraryResourceTypeContributor.
				hasViewPermission(_permissionChecker, _depotEntry));

		Mockito.when(
			_portletResourcePermission.contains(
				_permissionChecker, _GROUP_ID, ActionKeys.VIEW)
		).thenReturn(
			true
		);

		Assert.assertTrue(
			_displayPageTemplateFolderDesignLibraryResourceTypeContributor.
				hasViewPermission(_permissionChecker, _depotEntry));
	}

	private static final long _GROUP_ID = RandomTestUtil.randomLong();

	private final DepotEntry _depotEntry = Mockito.mock(DepotEntry.class);
	private final DisplayPageTemplateFolderDesignLibraryResourceTypeContributor
		_displayPageTemplateFolderDesignLibraryResourceTypeContributor =
			new DisplayPageTemplateFolderDesignLibraryResourceTypeContributor();
	private final PermissionChecker _permissionChecker = Mockito.mock(
		PermissionChecker.class);
	private final PortletResourcePermission _portletResourcePermission =
		Mockito.mock(PortletResourcePermission.class);

}
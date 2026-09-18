/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.page.template.admin.web.internal.display.context;

import com.liferay.design.library.util.DesignLibraryUtil;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.CreationMenu;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.DropdownItem;
import com.liferay.portal.kernel.language.Language;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Portlet;
import com.liferay.portal.kernel.model.PortletApp;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.portlet.MockLiferayPortletActionRequest;
import com.liferay.portal.kernel.test.portlet.MockLiferayPortletRenderResponse;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.MockedStatic;
import org.mockito.Mockito;

/**
 * @author Georgel Pop
 */
public class DisplayPageManagementToolbarDisplayContextTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Before
	public void setUp() {
		_setUpHttpServletRequest();
		_setUpLanguageUtil();
		_setUpThemeDisplay();
	}

	@After
	public void tearDown() {
		_designLibraryUtilMockedStatic.close();
	}

	@Test
	@TestInfo("LPD-104842")
	public void testGetCreationMenu() {
		DisplayPageManagementToolbarDisplayContext
			displayPageManagementToolbarDisplayContext =
				_getDisplayPageManagementToolbarDisplayContext();

		_testGetCreationMenu(displayPageManagementToolbarDisplayContext);

		_testGetCreationMenuInDesignLibraryGroup(
			displayPageManagementToolbarDisplayContext);
	}

	private DisplayPageManagementToolbarDisplayContext
		_getDisplayPageManagementToolbarDisplayContext() {

		return new DisplayPageManagementToolbarDisplayContext(
			_httpServletRequest, _getMockLiferayPortletActionRequest(),
			new MockLiferayPortletRenderResponse(),
			Mockito.mock(DisplayPageDisplayContext.class));
	}

	private MockLiferayPortletActionRequest
		_getMockLiferayPortletActionRequest() {

		return new MockLiferayPortletActionRequest() {

			@Override
			public Portlet getPortlet() {
				Portlet portlet = Mockito.mock(Portlet.class);

				PortletApp portletApp = Mockito.mock(PortletApp.class);

				Mockito.when(
					portlet.getPortletApp()
				).thenReturn(
					portletApp
				);

				return portlet;
			}

		};
	}

	private List<DropdownItem> _getPrimaryDropdownItems(
		DisplayPageManagementToolbarDisplayContext
			displayPageManagementToolbarDisplayContext) {

		CreationMenu creationMenu =
			displayPageManagementToolbarDisplayContext.getCreationMenu();

		return (List<DropdownItem>)creationMenu.get("primaryItems");
	}

	private void _setUpHttpServletRequest() {
		Mockito.when(
			_httpServletRequest.getAttribute(WebKeys.THEME_DISPLAY)
		).thenReturn(
			_themeDisplay
		);
	}

	private void _setUpLanguageUtil() {
		LanguageUtil languageUtil = new LanguageUtil();

		languageUtil.setLanguage(Mockito.mock(Language.class));
	}

	private void _setUpThemeDisplay() {
		Mockito.when(
			_themeDisplay.getScopeGroup()
		).thenReturn(
			_group
		);
	}

	private void _testGetCreationMenu(
		DisplayPageManagementToolbarDisplayContext
			displayPageManagementToolbarDisplayContext) {

		List<DropdownItem> primaryDropdownItems = _getPrimaryDropdownItems(
			displayPageManagementToolbarDisplayContext);

		Assert.assertEquals(
			primaryDropdownItems.toString(), 2, primaryDropdownItems.size());

		DropdownItem primaryDropdownItem = primaryDropdownItems.get(1);

		Assert.assertNull(primaryDropdownItem.get("data"));
		Assert.assertNotNull(primaryDropdownItem.get("href"));
	}

	private void _testGetCreationMenuInDesignLibraryGroup(
		DisplayPageManagementToolbarDisplayContext
			displayPageManagementToolbarDisplayContext) {

		_designLibraryUtilMockedStatic.when(
			() -> DesignLibraryUtil.isDesignLibraryScope(_group)
		).thenReturn(
			true
		);

		List<DropdownItem> primaryDropdownItems = _getPrimaryDropdownItems(
			displayPageManagementToolbarDisplayContext);

		Assert.assertEquals(
			primaryDropdownItems.toString(), 2, primaryDropdownItems.size());

		DropdownItem primaryDropdownItem = primaryDropdownItems.get(1);

		Map<String, Object> data = (Map<String, Object>)primaryDropdownItem.get(
			"data");

		Assert.assertEquals("addDisplayPage", data.get("action"));
		Assert.assertTrue(data.containsKey("addDisplayPageURL"));

		Assert.assertNull(primaryDropdownItem.get("href"));
	}

	private final MockedStatic<DesignLibraryUtil>
		_designLibraryUtilMockedStatic = Mockito.mockStatic(
			DesignLibraryUtil.class);
	private final Group _group = Mockito.mock(Group.class);
	private final HttpServletRequest _httpServletRequest = Mockito.mock(
		HttpServletRequest.class);
	private final ThemeDisplay _themeDisplay = Mockito.mock(ThemeDisplay.class);

}
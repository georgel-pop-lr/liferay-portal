/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.content.page.editor.web.internal.display.context;

import com.liferay.design.library.util.DesignLibraryUtil;
import com.liferay.frontend.token.definition.FrontendTokenDefinitionRegistry;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.test.rule.LiferayUnitTestRule;
import com.liferay.style.book.model.StyleBookEntry;
import com.liferay.style.book.util.StyleBookEntryProviderUtil;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.MockedStatic;
import org.mockito.Mockito;

/**
 * @author Gabriel Lima
 */
public class ContentPageEditorDisplayContextTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@AfterClass
	public static void tearDownClass() {
		_styleBookEntryProviderUtilMockedStatic.close();
	}

	@Test
	@TestInfo("LPD-104844")
	public void testGetDefaultRedirect() throws Exception {
		ContentPageEditorDisplayContext contentPageEditorDisplayContext =
			Mockito.mock(ContentPageEditorDisplayContext.class);

		HttpServletRequest httpServletRequest = Mockito.mock(
			HttpServletRequest.class);

		ReflectionTestUtil.setFieldValue(
			contentPageEditorDisplayContext, "httpServletRequest",
			httpServletRequest);

		ThemeDisplay themeDisplay = Mockito.mock(ThemeDisplay.class);

		Group group = Mockito.mock(Group.class);

		Mockito.when(
			themeDisplay.getScopeGroup()
		).thenReturn(
			group
		);

		String urlCurrent = RandomTestUtil.randomString();

		Mockito.when(
			themeDisplay.getURLCurrent()
		).thenReturn(
			urlCurrent
		);

		ReflectionTestUtil.setFieldValue(
			contentPageEditorDisplayContext, "themeDisplay", themeDisplay);

		Assert.assertEquals(
			urlCurrent,
			ReflectionTestUtil.invoke(
				contentPageEditorDisplayContext, "_getDefaultRedirect",
				new Class<?>[0]));

		try (MockedStatic<DesignLibraryUtil> designLibraryUtilMockedStatic =
				Mockito.mockStatic(DesignLibraryUtil.class)) {

			String designLibraryResourcesURL = RandomTestUtil.randomString();

			designLibraryUtilMockedStatic.when(
				() -> DesignLibraryUtil.isDesignLibraryScope(group)
			).thenReturn(
				true
			);

			designLibraryUtilMockedStatic.when(
				() -> DesignLibraryUtil.getDesignLibraryResourcesURL(
					group, httpServletRequest)
			).thenReturn(
				designLibraryResourcesURL
			);

			Assert.assertEquals(
				designLibraryResourcesURL,
				ReflectionTestUtil.invoke(
					contentPageEditorDisplayContext, "_getDefaultRedirect",
					new Class<?>[0]));
		}
	}

	@Test
	public void testGetStyleBookEntryERC() throws Exception {
		ContentPageEditorDisplayContext contentPageEditorDisplayContext =
			Mockito.mock(ContentPageEditorDisplayContext.class);

		ReflectionTestUtil.setFieldValue(
			contentPageEditorDisplayContext, "_frontendTokenDefinitionRegistry",
			Mockito.mock(FrontendTokenDefinitionRegistry.class));

		ThemeDisplay themeDisplay = Mockito.mock(ThemeDisplay.class);

		Layout layout = Mockito.mock(Layout.class);

		Mockito.when(
			themeDisplay.getLayout()
		).thenReturn(
			layout
		);

		ReflectionTestUtil.setFieldValue(
			contentPageEditorDisplayContext, "themeDisplay", themeDisplay);

		_styleBookEntryProviderUtilMockedStatic.when(
			() -> StyleBookEntryProviderUtil.getStyleBookEntry(layout)
		).thenReturn(
			Mockito.mock(StyleBookEntry.class)
		);

		Assert.assertEquals(
			StringPool.BLANK,
			ReflectionTestUtil.invoke(
				contentPageEditorDisplayContext, "_getStyleBookEntryERC",
				new Class<?>[0]));
	}

	private static final MockedStatic<StyleBookEntryProviderUtil>
		_styleBookEntryProviderUtilMockedStatic = Mockito.mockStatic(
			StyleBookEntryProviderUtil.class);

}
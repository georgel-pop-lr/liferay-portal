/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.fragment.web.internal.servlet.taglib.util;

import com.liferay.fragment.model.FragmentCollection;
import com.liferay.fragment.model.FragmentComposition;
import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.service.FragmentCompositionLocalServiceUtil;
import com.liferay.fragment.service.FragmentEntryLocalServiceUtil;
import com.liferay.fragment.web.internal.display.context.FragmentDisplayContext;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import java.util.Collections;
import java.util.List;

import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

import org.mockito.MockedStatic;
import org.mockito.Mockito;

/**
 * @author Eudaldo Alonso
 */
public class FragmentCollectionActionDropdownItemsProviderTest
	extends BaseActionDropdownItemsProviderTestCase {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Before
	@Override
	public void setUp() {
		super.setUp();

		_setUpFragmentDisplayContext();
	}

	@Test
	@TestInfo("LPD-63087")
	public void testGetActionDropdowns() {
		setUpFragmentPermission(true);

		_setUpFragmentCollection(false);

		FragmentEntry fragmentEntry = Mockito.mock(FragmentEntry.class);

		Mockito.when(
			fragmentEntry.isMarketplace()
		).thenReturn(
			false
		);

		Mockito.when(
			fragmentEntry.isTypeReact()
		).thenReturn(
			false
		);

		try (MockedStatic<FragmentCompositionLocalServiceUtil>
				fragmentCompositionLocalServiceUtilMockedStatic =
					Mockito.mockStatic(
						FragmentCompositionLocalServiceUtil.class);
			MockedStatic<FragmentEntryLocalServiceUtil>
				fragmentEntryLocalServiceUtilMockedStatic = Mockito.mockStatic(
					FragmentEntryLocalServiceUtil.class)) {

			_mockServiceCalls(
				fragmentCompositionLocalServiceUtilMockedStatic,
				fragmentEntryLocalServiceUtilMockedStatic,
				Collections.emptyList(),
				Collections.singletonList(fragmentEntry));

			FragmentCollectionActionDropdownItemsProvider
				fragmentCollectionActionDropdownItemsProvider =
					new FragmentCollectionActionDropdownItemsProvider(
						_fragmentDisplayContext, httpServletRequest,
						renderResponse);

			assertDropdownItemsInCorrectOrder(
				fragmentCollectionActionDropdownItemsProvider.
					getActionDropdownItems(),
				"edit", "export", "import", "delete");
		}
	}

	@Test
	@TestInfo("LPD-63087")
	public void testGetActionDropdownsForFragmentCollectionWithExportableComposition() {
		setUpFragmentPermission(true);

		_setUpFragmentCollection(false);

		FragmentComposition fragmentComposition = Mockito.mock(
			FragmentComposition.class);

		Mockito.when(
			fragmentComposition.isMarketplace()
		).thenReturn(
			false
		);

		try (MockedStatic<FragmentCompositionLocalServiceUtil>
				fragmentCompositionLocalServiceUtilMockedStatic =
					Mockito.mockStatic(
						FragmentCompositionLocalServiceUtil.class);
			MockedStatic<FragmentEntryLocalServiceUtil>
				fragmentEntryLocalServiceUtilMockedStatic = Mockito.mockStatic(
					FragmentEntryLocalServiceUtil.class)) {

			_mockServiceCalls(
				fragmentCompositionLocalServiceUtilMockedStatic,
				fragmentEntryLocalServiceUtilMockedStatic,
				Collections.singletonList(fragmentComposition),
				Collections.emptyList());

			FragmentCollectionActionDropdownItemsProvider
				fragmentCollectionActionDropdownItemsProvider =
					new FragmentCollectionActionDropdownItemsProvider(
						_fragmentDisplayContext, httpServletRequest,
						renderResponse);

			assertDropdownItemsInCorrectOrder(
				fragmentCollectionActionDropdownItemsProvider.
					getActionDropdownItems(),
				"edit", "export", "import", "delete");
		}
	}

	@Test
	@TestInfo("LPD-63087")
	public void testGetActionDropdownsForFragmentCollectionWithOnlyMarketplaceFragments() {
		setUpFragmentPermission(true);

		_setUpFragmentCollection(false);

		FragmentEntry fragmentEntry = Mockito.mock(FragmentEntry.class);

		Mockito.when(
			fragmentEntry.isMarketplace()
		).thenReturn(
			true
		);

		try (MockedStatic<FragmentCompositionLocalServiceUtil>
				fragmentCompositionLocalServiceUtilMockedStatic =
					Mockito.mockStatic(
						FragmentCompositionLocalServiceUtil.class);
			MockedStatic<FragmentEntryLocalServiceUtil>
				fragmentEntryLocalServiceUtilMockedStatic = Mockito.mockStatic(
					FragmentEntryLocalServiceUtil.class)) {

			_mockServiceCalls(
				fragmentCompositionLocalServiceUtilMockedStatic,
				fragmentEntryLocalServiceUtilMockedStatic,
				Collections.emptyList(),
				Collections.singletonList(fragmentEntry));

			FragmentCollectionActionDropdownItemsProvider
				fragmentCollectionActionDropdownItemsProvider =
					new FragmentCollectionActionDropdownItemsProvider(
						_fragmentDisplayContext, httpServletRequest,
						renderResponse);

			assertDropdownItemsInCorrectOrder(
				fragmentCollectionActionDropdownItemsProvider.
					getActionDropdownItems(),
				"edit", "import", "delete");
		}
	}

	@Test
	@TestInfo("LPD-63087")
	public void testGetActionDropdownsForMarketplaceFragmentCollection() {
		setUpFragmentPermission(true);

		_setUpFragmentCollection(true);

		try (MockedStatic<FragmentCompositionLocalServiceUtil>
				fragmentCompositionLocalServiceUtilMockedStatic =
					Mockito.mockStatic(
						FragmentCompositionLocalServiceUtil.class);
			MockedStatic<FragmentEntryLocalServiceUtil>
				fragmentEntryLocalServiceUtilMockedStatic = Mockito.mockStatic(
					FragmentEntryLocalServiceUtil.class)) {

			_mockServiceCalls(
				fragmentCompositionLocalServiceUtilMockedStatic,
				fragmentEntryLocalServiceUtilMockedStatic,
				Collections.emptyList(), Collections.emptyList());

			FragmentCollectionActionDropdownItemsProvider
				fragmentCollectionActionDropdownItemsProvider =
					new FragmentCollectionActionDropdownItemsProvider(
						_fragmentDisplayContext, httpServletRequest,
						renderResponse);

			assertDropdownItemsInCorrectOrder(
				fragmentCollectionActionDropdownItemsProvider.
					getActionDropdownItems(),
				"edit", "import", "delete");
		}
	}

	@Test
	@TestInfo("LPD-63087")
	public void testGetActionDropdownsForMarketplaceFragmentCollectionWithExportableFragment() {
		setUpFragmentPermission(true);

		_setUpFragmentCollection(true);

		FragmentEntry fragmentEntry = Mockito.mock(FragmentEntry.class);

		Mockito.when(
			fragmentEntry.isMarketplace()
		).thenReturn(
			false
		);

		Mockito.when(
			fragmentEntry.isTypeReact()
		).thenReturn(
			false
		);

		try (MockedStatic<FragmentCompositionLocalServiceUtil>
				fragmentCompositionLocalServiceUtilMockedStatic =
					Mockito.mockStatic(
						FragmentCompositionLocalServiceUtil.class);
			MockedStatic<FragmentEntryLocalServiceUtil>
				fragmentEntryLocalServiceUtilMockedStatic = Mockito.mockStatic(
					FragmentEntryLocalServiceUtil.class)) {

			_mockServiceCalls(
				fragmentCompositionLocalServiceUtilMockedStatic,
				fragmentEntryLocalServiceUtilMockedStatic,
				Collections.emptyList(),
				Collections.singletonList(fragmentEntry));

			FragmentCollectionActionDropdownItemsProvider
				fragmentCollectionActionDropdownItemsProvider =
					new FragmentCollectionActionDropdownItemsProvider(
						_fragmentDisplayContext, httpServletRequest,
						renderResponse);

			assertDropdownItemsInCorrectOrder(
				fragmentCollectionActionDropdownItemsProvider.
					getActionDropdownItems(),
				"edit", "export", "import", "delete");
		}
	}

	@Test
	@TestInfo("LPD-63087")
	public void testGetActionDropdownsWithReactFragment() {
		setUpFragmentPermission(true);

		_setUpFragmentCollection(false);

		FragmentEntry fragmentEntry = Mockito.mock(FragmentEntry.class);

		Mockito.when(
			fragmentEntry.isTypeReact()
		).thenReturn(
			true
		);

		Mockito.when(
			fragmentEntry.isMarketplace()
		).thenReturn(
			false
		);

		try (MockedStatic<FragmentCompositionLocalServiceUtil>
				fragmentCompositionLocalServiceUtilMockedStatic =
					Mockito.mockStatic(
						FragmentCompositionLocalServiceUtil.class);
			MockedStatic<FragmentEntryLocalServiceUtil>
				fragmentEntryLocalServiceUtilMockedStatic = Mockito.mockStatic(
					FragmentEntryLocalServiceUtil.class)) {

			_mockServiceCalls(
				fragmentCompositionLocalServiceUtilMockedStatic,
				fragmentEntryLocalServiceUtilMockedStatic,
				Collections.emptyList(),
				Collections.singletonList(fragmentEntry));

			FragmentCollectionActionDropdownItemsProvider
				fragmentCollectionActionDropdownItemsProvider =
					new FragmentCollectionActionDropdownItemsProvider(
						_fragmentDisplayContext, httpServletRequest,
						renderResponse);

			assertDropdownItemsInCorrectOrder(
				fragmentCollectionActionDropdownItemsProvider.
					getActionDropdownItems(),
				"edit", "import", "delete");
		}
	}

	private void _mockServiceCalls(
		MockedStatic<FragmentCompositionLocalServiceUtil>
			fragmentCompositionLocalServiceUtilMockedStatic,
		MockedStatic<FragmentEntryLocalServiceUtil>
			fragmentEntryLocalServiceUtilMockedStatic,
		List<FragmentComposition> compositions, List<FragmentEntry> entries) {

		fragmentCompositionLocalServiceUtilMockedStatic.when(
			() -> FragmentCompositionLocalServiceUtil.getFragmentCompositions(
				Mockito.anyLong())
		).thenReturn(
			compositions
		);

		fragmentEntryLocalServiceUtilMockedStatic.when(
			() -> FragmentEntryLocalServiceUtil.getFragmentEntries(
				Mockito.anyLong())
		).thenReturn(
			entries
		);
	}

	private void _setUpFragmentCollection(boolean marketplace) {
		Mockito.when(
			_fragmentCollection.getFragmentCollectionId()
		).thenReturn(
			1L
		);

		Mockito.when(
			_fragmentDisplayContext.getFragmentCollection()
		).thenReturn(
			_fragmentCollection
		);

		Mockito.when(
			_fragmentCollection.isMarketplace()
		).thenReturn(
			marketplace
		);
	}

	private void _setUpFragmentDisplayContext() {
		Mockito.when(
			_fragmentDisplayContext.hasDeletePermission()
		).thenReturn(
			true
		);

		Mockito.when(
			_fragmentDisplayContext.hasUpdatePermission()
		).thenReturn(
			true
		);
	}

	private final FragmentCollection _fragmentCollection = Mockito.mock(
		FragmentCollection.class);
	private final FragmentDisplayContext _fragmentDisplayContext = Mockito.mock(
		FragmentDisplayContext.class);

}
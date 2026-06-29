/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.admin.site.internal.dto.v1_0.converter;

import com.liferay.exportimport.kernel.lar.ExportImportThreadLocal;
import com.liferay.exportimport.kernel.staging.LayoutStagingUtil;
import com.liferay.headless.admin.site.dto.v1_0.LastPublishInformation;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.LayoutBranch;
import com.liferay.portal.kernel.model.LayoutRevision;
import com.liferay.portal.kernel.model.LayoutSetBranch;
import com.liferay.portal.kernel.service.LayoutBranchLocalService;
import com.liferay.portal.kernel.service.LayoutSetBranchLocalService;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import org.junit.AfterClass;
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
public class SitePageDTOConverterTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@AfterClass
	public static void tearDownClass() {
		_exportImportThreadLocalMockedStatic.close();
		_layoutStagingUtilMockedStatic.close();
	}

	@Before
	public void setUp() {
		ReflectionTestUtil.setFieldValue(
			_sitePageDTOConverter, "_layoutBranchLocalService",
			_layoutBranchLocalService);
		ReflectionTestUtil.setFieldValue(
			_sitePageDTOConverter, "_layoutSetBranchLocalService",
			_layoutSetBranchLocalService);
	}

	@Test
	@TestInfo("LPD-87641")
	public void testToLastPublishInformation() {
		long layoutBranchId = RandomTestUtil.randomLong();
		String layoutBranchName = RandomTestUtil.randomString();
		long layoutRevisionId = RandomTestUtil.randomLong();
		long layoutSetBranchId = RandomTestUtil.randomLong();
		String layoutSetBranchName = RandomTestUtil.randomString();

		Layout layout = Mockito.mock(Layout.class);
		LayoutBranch layoutBranch = Mockito.mock(LayoutBranch.class);
		LayoutRevision layoutRevision = Mockito.mock(LayoutRevision.class);
		LayoutSetBranch layoutSetBranch = Mockito.mock(LayoutSetBranch.class);

		_exportImportThreadLocalMockedStatic.when(
			ExportImportThreadLocal::isStagingInProcess
		).thenReturn(
			true
		);

		_layoutStagingUtilMockedStatic.when(
			() -> LayoutStagingUtil.getLayoutRevision(layout)
		).thenReturn(
			layoutRevision
		);

		Mockito.when(
			layoutRevision.getLayoutBranchId()
		).thenReturn(
			layoutBranchId
		);

		Mockito.when(
			layoutRevision.getLayoutRevisionId()
		).thenReturn(
			layoutRevisionId
		);

		Mockito.when(
			layoutRevision.getLayoutSetBranchId()
		).thenReturn(
			layoutSetBranchId
		);

		Mockito.when(
			_layoutBranchLocalService.fetchLayoutBranch(layoutBranchId)
		).thenReturn(
			layoutBranch
		);

		Mockito.when(
			layoutBranch.getName()
		).thenReturn(
			layoutBranchName
		);

		Mockito.when(
			_layoutSetBranchLocalService.fetchLayoutSetBranch(layoutSetBranchId)
		).thenReturn(
			layoutSetBranch
		);

		Mockito.when(
			layoutSetBranch.getName()
		).thenReturn(
			layoutSetBranchName
		);

		LastPublishInformation lastPublishInformation =
			ReflectionTestUtil.invoke(
				_sitePageDTOConverter, "_toLastPublishInformation",
				new Class<?>[] {Layout.class}, layout);

		Assert.assertEquals(
			Long.valueOf(layoutBranchId),
			lastPublishInformation.getLayoutBranchId());
		Assert.assertEquals(
			layoutBranchName, lastPublishInformation.getLayoutBranchName());
		Assert.assertEquals(
			Long.valueOf(layoutRevisionId),
			lastPublishInformation.getLayoutRevisionId());
		Assert.assertEquals(
			Long.valueOf(layoutSetBranchId),
			lastPublishInformation.getLayoutSetBranchId());
		Assert.assertEquals(
			layoutSetBranchName,
			lastPublishInformation.getLayoutSetBranchName());
	}

	private static final MockedStatic<ExportImportThreadLocal>
		_exportImportThreadLocalMockedStatic = Mockito.mockStatic(
			ExportImportThreadLocal.class);
	private static final MockedStatic<LayoutStagingUtil>
		_layoutStagingUtilMockedStatic = Mockito.mockStatic(
			LayoutStagingUtil.class);

	private final LayoutBranchLocalService _layoutBranchLocalService =
		Mockito.mock(LayoutBranchLocalService.class);
	private final LayoutSetBranchLocalService _layoutSetBranchLocalService =
		Mockito.mock(LayoutSetBranchLocalService.class);
	private final SitePageDTOConverter _sitePageDTOConverter =
		new SitePageDTOConverter();

}
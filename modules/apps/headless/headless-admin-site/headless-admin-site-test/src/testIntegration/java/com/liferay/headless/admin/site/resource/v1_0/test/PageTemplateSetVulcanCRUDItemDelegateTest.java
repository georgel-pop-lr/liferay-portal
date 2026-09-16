/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.admin.site.resource.v1_0.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.depot.model.DepotEntry;
import com.liferay.headless.admin.site.dto.v1_0.PageTemplateSet;
import com.liferay.headless.admin.site.resource.v1_0.PageTemplateSetResource;
import com.liferay.headless.admin.site.resource.v1_0.test.util.DesignLibraryTestUtil;
import com.liferay.layout.page.template.model.LayoutPageTemplateCollection;
import com.liferay.layout.page.template.test.util.LayoutPageTemplateTestUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalException;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.test.AssertUtils;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.util.FeatureFlagTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.test.util.UserTestUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.test.rule.FeatureFlag;
import com.liferay.portal.test.rule.FeatureFlags;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.crud.VulcanCRUDItemDelegate;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Georgel Pop
 */
@FeatureFlags(featureFlags = @FeatureFlag("LPD-57283"))
@RunWith(Arquillian.class)
public class PageTemplateSetVulcanCRUDItemDelegateTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@Before
	public void setUp() throws Exception {
		FeatureFlagTestUtil.invokeFeatureFlagListeners(
			TestPropsValues.getCompanyId(), true, "LPD-57283");

		_company = _companyLocalService.getCompany(
			TestPropsValues.getCompanyId());

		_pageTemplateSetResource.setContextAcceptLanguage(
			new AcceptLanguage() {

				@Override
				public List<Locale> getLocales() {
					return Arrays.asList(LocaleUtil.getDefault());
				}

				@Override
				public String getPreferredLanguageId() {
					return LocaleUtil.toLanguageId(LocaleUtil.getDefault());
				}

				@Override
				public Locale getPreferredLocale() {
					return LocaleUtil.getDefault();
				}

			});
		_pageTemplateSetResource.setContextCompany(_company);
		_pageTemplateSetResource.setContextUser(TestPropsValues.getUser());
	}

	@Test
	@TestInfo("LPD-105724")
	public void testGetItem() throws Exception {
		DepotEntry depotEntry = DesignLibraryTestUtil.addDepotEntry(
			TestPropsValues.getGroupId());

		LayoutPageTemplateCollection layoutPageTemplateCollection =
			LayoutPageTemplateTestUtil.addLayoutPageTemplateCollection(
				depotEntry.getGroupId());

		VulcanCRUDItemDelegate<PageTemplateSet> vulcanCRUDItemDelegate =
			(VulcanCRUDItemDelegate<PageTemplateSet>)_pageTemplateSetResource;

		_testGetItem(layoutPageTemplateCollection, vulcanCRUDItemDelegate);
		_testGetItemWithoutViewDepotEntryPermission(
			depotEntry, layoutPageTemplateCollection, vulcanCRUDItemDelegate);
	}

	private void _testGetItem(
			LayoutPageTemplateCollection layoutPageTemplateCollection,
			VulcanCRUDItemDelegate<PageTemplateSet> vulcanCRUDItemDelegate)
		throws Exception {

		PageTemplateSet pageTemplateSet = vulcanCRUDItemDelegate.getItem(
			layoutPageTemplateCollection.getLayoutPageTemplateCollectionId());

		Assert.assertEquals(
			layoutPageTemplateCollection.getExternalReferenceCode(),
			pageTemplateSet.getExternalReferenceCode());
		Assert.assertEquals(
			layoutPageTemplateCollection.getName(), pageTemplateSet.getName());
	}

	private void _testGetItemWithoutViewDepotEntryPermission(
			DepotEntry depotEntry,
			LayoutPageTemplateCollection layoutPageTemplateCollection,
			VulcanCRUDItemDelegate<PageTemplateSet> vulcanCRUDItemDelegate)
		throws Exception {

		User user =
			DesignLibraryTestUtil.
				addUserWithViewLayoutPageTemplateCollectionPermission(
					_company, RandomTestUtil.randomString());

		_pageTemplateSetResource.setContextUser(user);

		UserTestUtil.setUser(user);

		AssertUtils.assertFailure(
			PrincipalException.MustHavePermission.class,
			StringBundler.concat(
				"User ", user.getUserId(), " must have VIEW permission for ",
				DepotEntry.class.getName(), StringPool.SPACE,
				depotEntry.getDepotEntryId()),
			() -> vulcanCRUDItemDelegate.getItem(
				layoutPageTemplateCollection.
					getLayoutPageTemplateCollectionId()));
	}

	private Company _company;

	@Inject
	private CompanyLocalService _companyLocalService;

	@Inject
	private PageTemplateSetResource _pageTemplateSetResource;

}
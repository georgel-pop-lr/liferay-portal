/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.fragment.internal.upgrade.v3_0_0.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.change.tracking.test.util.BaseCTUpgradeProcessTestCase;
import com.liferay.counter.kernel.service.CounterLocalService;
import com.liferay.fragment.entry.processor.constants.FragmentEntryProcessorConstants;
import com.liferay.fragment.model.FragmentCollection;
import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.fragment.model.impl.FragmentEntryLinkModelImpl;
import com.liferay.fragment.service.FragmentEntryLinkLocalService;
import com.liferay.fragment.service.FragmentEntryLocalService;
import com.liferay.fragment.test.util.FragmentEntryTestUtil;
import com.liferay.fragment.test.util.FragmentTestUtil;
import com.liferay.layout.test.util.ContentLayoutTestUtil;
import com.liferay.layout.test.util.LayoutTestUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.cache.MultiVMPool;
import com.liferay.portal.kernel.dao.db.DB;
import com.liferay.portal.kernel.dao.db.DBInspector;
import com.liferay.portal.kernel.dao.db.DBManagerUtil;
import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.dao.orm.EntityCache;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.change.tracking.CTModel;
import com.liferay.portal.kernel.service.ClassNameLocalService;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.change.tracking.CTService;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;
import com.liferay.portal.kernel.upgrade.UpgradeStep;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.version.Version;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;
import com.liferay.portal.upgrade.registry.UpgradeStepRegistrator;
import com.liferay.portal.upgrade.test.util.UpgradeTestUtil;
import com.liferay.segments.service.SegmentsExperienceLocalService;

import java.lang.reflect.Method;

import java.sql.Connection;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Georgel Pop
 */
@RunWith(Arquillian.class)
public class FragmentEntryLinkERCUpgradeProcessTest
	extends BaseCTUpgradeProcessTestCase {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@Before
	public void setUp() throws Exception {
		_connection = DataAccess.getConnection();

		_db = DBManagerUtil.getDB();

		_dbInspector = new DBInspector(_connection);

		_db.alterTableAddColumn(
			_connection, FragmentEntryLinkModelImpl.TABLE_NAME,
			"originalFragmentEntryLinkId", "LONG");

		_db.alterTableAddColumn(
			_connection, FragmentEntryLinkModelImpl.TABLE_NAME,
			"fragmentEntryId", "LONG");

		Company company = _companyLocalService.getCompany(
			TestPropsValues.getCompanyId());

		_globalGroup = company.getGroup();

		_group = GroupTestUtil.addGroup();

		_layout = LayoutTestUtil.addTypeContentLayout(_group);

		_draftLayout = _layout.fetchDraftLayout();

		_segmentsExperienceId =
			_segmentsExperienceLocalService.fetchDefaultSegmentsExperienceId(
				_draftLayout.getPlid());
	}

	@After
	public void tearDown() throws Exception {
		DataAccess.cleanUp(_connection);
	}

	@Test
	public void testUpgrade() throws Exception {
		ServiceContext globalServiceContext =
			ServiceContextTestUtil.getServiceContext(
				_globalGroup.getGroupId(), TestPropsValues.getUserId());

		FragmentCollection globalFragmentCollection =
			FragmentTestUtil.addFragmentCollection(
				globalServiceContext.getScopeGroupId());

		FragmentEntry globalFragmentEntry =
			FragmentEntryTestUtil.addFragmentEntry(
				globalFragmentCollection.getFragmentCollectionId());

		FragmentEntryLink globalDraftLayoutFragmentEntryLink =
			ContentLayoutTestUtil.addFragmentEntryLinkToLayout(
				null, globalFragmentEntry.getCss(),
				globalFragmentEntry.getConfiguration(),
				globalFragmentEntry.getFragmentEntryId(),
				globalFragmentEntry.getHtml(), globalFragmentEntry.getJs(),
				_draftLayout, globalFragmentEntry.getFragmentEntryKey(),
				globalFragmentEntry.getType(), null, 0, _segmentsExperienceId);

		FragmentEntryLink draftLayoutFragmentEntryLink =
			ContentLayoutTestUtil.addFragmentEntryLinkToLayout(
				null, _draftLayout, _segmentsExperienceId);

		ContentLayoutTestUtil.publishLayout(_draftLayout, _layout);

		List<FragmentEntryLink> fragmentEntryLinks =
			_fragmentEntryLinkLocalService.getFragmentEntryLinksByPlid(
				_layout.getGroupId(), _layout.getPlid());

		Assert.assertEquals(
			fragmentEntryLinks.toString(), 2, fragmentEntryLinks.size());

		FragmentEntryLink globalpublishedLayoutFragmentEntryLink =
			_fragmentEntryLinkLocalService.getFragmentEntryLink(
				_group.getGroupId(),
				globalDraftLayoutFragmentEntryLink.getFragmentEntryLinkId(),
				_layout.getPlid());

		FragmentEntryLink publishedLayoutFragmentEntryLink =
			_fragmentEntryLinkLocalService.getFragmentEntryLink(
				_group.getGroupId(),
				draftLayoutFragmentEntryLink.getFragmentEntryLinkId(),
				_layout.getPlid());

		long[] fragmentEntryLinkIds = {
			globalDraftLayoutFragmentEntryLink.getFragmentEntryLinkId(),
			draftLayoutFragmentEntryLink.getFragmentEntryLinkId(),
			globalpublishedLayoutFragmentEntryLink.getFragmentEntryLinkId(),
			publishedLayoutFragmentEntryLink.getFragmentEntryLinkId()
		};

		Map<Long, Map<String, Object>> expectedValuesMap = _getExpectedValues(
			fragmentEntryLinkIds);

		_updateFragmentEntryLinks(expectedValuesMap, fragmentEntryLinkIds);

		runUpgrade();

		_assertFragmentEntryLinks(expectedValuesMap, fragmentEntryLinkIds);

		_assertTableColumns();
	}

	@Override
	protected CTModel<?> addCTModel() throws Exception {
		return ContentLayoutTestUtil.addFragmentEntryLinkToLayout(
			"{}", _draftLayout, _segmentsExperienceId);
	}

	@Override
	protected CTService<?> getCTService() {
		return _fragmentEntryLinkLocalService;
	}

	@Override
	protected void runUpgrade() throws Exception {
		UpgradeProcess[] upgradeProcesses = UpgradeTestUtil.getUpgradeSteps(
			_upgradeStepRegistrator, new Version(3, 0, 0));

		for (UpgradeProcess upgradeProcess : upgradeProcesses) {
			Class<?> upgradeProcessClass = upgradeProcess.getClass();

			Method getPostUpgradeStepsMethod =
				upgradeProcessClass.getDeclaredMethod("getPostUpgradeSteps");

			getPostUpgradeStepsMethod.setAccessible(true);

			UpgradeStep[] postUpgradeSteps =
				(UpgradeStep[])getPostUpgradeStepsMethod.invoke(upgradeProcess);

			upgradeProcess.upgrade();

			postUpgradeSteps[0].upgrade();
		}

		_entityCache.clearCache();
		_multiVMPool.clear();
	}

	@Override
	protected CTModel<?> updateCTModel(CTModel<?> ctModel) throws Exception {
		FragmentEntryLink fragmentEntryLink = (FragmentEntryLink)ctModel;

		return _fragmentEntryLinkLocalService.updateFragmentEntryLink(
			TestPropsValues.getUserId(),
			fragmentEntryLink.getFragmentEntryLinkId(),
			JSONUtil.put(
				FragmentEntryProcessorConstants.
					KEY_FREEMARKER_FRAGMENT_ENTRY_PROCESSOR,
				JSONUtil.put(
					RandomTestUtil.randomString(),
					RandomTestUtil.randomString())
			).toString());
	}

	private void _assertFragmentEntryLinks(
			Map<Long, Map<String, Object>> expectedValuesMap,
			long... fragmentEntryLinkIds)
		throws Exception {

		for (long fragmentEntryLinkId : fragmentEntryLinkIds) {
			FragmentEntryLink fragmentEntryLink =
				_fragmentEntryLinkLocalService.getFragmentEntryLink(
					fragmentEntryLinkId);

			Map<String, Object> expectedValues = expectedValuesMap.get(
				fragmentEntryLinkId);

			Assert.assertEquals(
				expectedValues.get("originalFragmentEntryLinkId"),
				fragmentEntryLink.getOriginalFragmentEntryLinkId());
			Assert.assertEquals(
				expectedValues.get("fragmentEntryId"),
				fragmentEntryLink.getFragmentEntryId());
			Assert.assertEquals(
				expectedValues.get("fragmentEntryExternalReferenceCode"),
				fragmentEntryLink.getFragmentEntryExternalReferenceCode());
			Assert.assertEquals(
				expectedValues.get("fragmentEntryScopeExternalReferenceCode"),
				fragmentEntryLink.getFragmentEntryScopeExternalReferenceCode());
			Assert.assertEquals(
				expectedValues.get(
					"originalFragmentEntryLinkExternalReferenceCode"),
				fragmentEntryLink.
					getOriginalFragmentEntryLinkExternalReferenceCode());
		}
	}

	private void _assertTableColumns() throws Exception {
		Assert.assertFalse(
			_dbInspector.hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"originalFragmentEntryLinkId"));
		Assert.assertFalse(
			_dbInspector.hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME, "fragmentEntryId"));
		Assert.assertTrue(
			_dbInspector.hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"originalFragmentEntryLinkERC"));
		Assert.assertTrue(
			_dbInspector.hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME, "fragmentEntryERC"));
		Assert.assertTrue(
			_dbInspector.hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"fragmentEntryScopeERC"));
	}

	private Map<Long, Map<String, Object>> _getExpectedValues(
			long... fragmentEntryLinkIds)
		throws Exception {

		Map<Long, Map<String, Object>> expectedValuesMap = new HashMap<>();

		for (long fragmentEntryLinkId : fragmentEntryLinkIds) {
			FragmentEntryLink fragmentEntryLink =
				_fragmentEntryLinkLocalService.getFragmentEntryLink(
					fragmentEntryLinkId);

			expectedValuesMap.put(
				fragmentEntryLinkId,
				HashMapBuilder.<String, Object>put(
					"fragmentEntryExternalReferenceCode",
					fragmentEntryLink.getFragmentEntryExternalReferenceCode()
				).put(
					"fragmentEntryId", fragmentEntryLink.getFragmentEntryId()
				).put(
					"fragmentEntryScopeExternalReferenceCode",
					fragmentEntryLink.
						getFragmentEntryScopeExternalReferenceCode()
				).put(
					"originalFragmentEntryLinkExternalReferenceCode",
					fragmentEntryLink.
						getOriginalFragmentEntryLinkExternalReferenceCode()
				).put(
					"originalFragmentEntryLinkId",
					fragmentEntryLink.getOriginalFragmentEntryLinkId()
				).build());
		}

		return expectedValuesMap;
	}

	private void _updateFragmentEntryLinks(
			Map<Long, Map<String, Object>> expectedValuesMap,
			long... fragmentEntryLinkIds)
		throws Exception {

		for (long fragmentEntryLinkId : fragmentEntryLinkIds) {
			FragmentEntryLink fragmentEntryLink =
				_fragmentEntryLinkLocalService.getFragmentEntryLink(
					fragmentEntryLinkId);

			_db.runSQL(
				StringBundler.concat(
					"UPDATE ", FragmentEntryLinkModelImpl.TABLE_NAME,
					" SET originalFragmentEntryLinkId = ",
					fragmentEntryLink.getOriginalFragmentEntryLinkId(),
					", fragmentEntryId = ",
					fragmentEntryLink.getFragmentEntryId(),
					" WHERE fragmentEntryLinkId = ",
					fragmentEntryLink.getFragmentEntryLinkId()));
		}

		_assertFragmentEntryLinks(expectedValuesMap, fragmentEntryLinkIds);
	}

	@Inject(
		filter = "(&(component.name=com.liferay.fragment.internal.upgrade.registry.FragmentServiceUpgradeStepRegistrator))"
	)
	private static UpgradeStepRegistrator _upgradeStepRegistrator;

	@Inject
	private ClassNameLocalService _classNameLocalService;

	@Inject
	private CompanyLocalService _companyLocalService;

	private Connection _connection;

	@Inject
	private CounterLocalService _counterLocalService;

	private DB _db;
	private DBInspector _dbInspector;
	private Layout _draftLayout;

	@Inject
	private EntityCache _entityCache;

	@Inject
	private FragmentEntryLinkLocalService _fragmentEntryLinkLocalService;

	@Inject
	private FragmentEntryLocalService _fragmentEntryLocalService;

	private Group _globalGroup;

	@DeleteAfterTestRun
	private Group _group;

	private Layout _layout;

	@Inject
	private MultiVMPool _multiVMPool;

	private long _segmentsExperienceId;

	@Inject
	private SegmentsExperienceLocalService _segmentsExperienceLocalService;

}
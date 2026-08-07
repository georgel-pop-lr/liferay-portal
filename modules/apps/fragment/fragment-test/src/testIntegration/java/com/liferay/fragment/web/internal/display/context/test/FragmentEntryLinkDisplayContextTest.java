/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.fragment.web.internal.display.context.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.fragment.model.FragmentCollection;
import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.fragment.test.util.FragmentDisplayContextTestUtil;
import com.liferay.fragment.test.util.FragmentEntryTestUtil;
import com.liferay.fragment.test.util.FragmentTestUtil;
import com.liferay.layout.page.template.constants.LayoutPageTemplateEntryTypeConstants;
import com.liferay.layout.page.template.model.LayoutPageTemplateEntry;
import com.liferay.layout.page.template.test.util.LayoutPageTemplateTestUtil;
import com.liferay.layout.test.util.LayoutTestUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.dao.search.SearchContainer;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.test.log.LogCapture;
import com.liferay.portal.test.log.LogEntry;
import com.liferay.portal.test.log.LoggerTestUtil;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;

import java.lang.reflect.Constructor;

import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Georgel Pop
 */
@RunWith(Arquillian.class)
public class FragmentEntryLinkDisplayContextTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@BeforeClass
	public static void setUpClass() throws Exception {
		_constructor = FragmentDisplayContextTestUtil.getConstructor(
			_CLASS_NAME);
	}

	@Before
	public void setUp() throws Exception {
		_group = GroupTestUtil.addGroup();
	}

	@Test
	@TestInfo("LPD-99652")
	public void testGetFragmentEntryLinkName() throws Exception {
		FragmentEntry fragmentEntry = _addFragmentEntry();

		Layout layout = LayoutTestUtil.addTypeContentLayout(_group);

		FragmentEntryLink fragmentEntryLink1 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, layout.getPlid());

		LayoutPageTemplateEntry layoutPageTemplateEntry =
			LayoutPageTemplateTestUtil.addLayoutPageTemplateEntry(
				_group.getGroupId(), LayoutPageTemplateEntryTypeConstants.BASIC,
				WorkflowConstants.STATUS_APPROVED);

		FragmentEntryLink fragmentEntryLink2 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, layoutPageTemplateEntry.getPlid());

		FragmentEntryLink fragmentEntryLink3 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, RandomTestUtil.randomLong());

		Object fragmentEntryLinkDisplayContext =
			_getFragmentEntryLinkDisplayContext(fragmentEntry);

		Assert.assertEquals(
			layout.getName(LocaleUtil.getDefault()),
			ReflectionTestUtil.invoke(
				fragmentEntryLinkDisplayContext, "getFragmentEntryLinkName",
				new Class<?>[] {FragmentEntryLink.class}, fragmentEntryLink1));
		Assert.assertEquals(
			layoutPageTemplateEntry.getName(),
			ReflectionTestUtil.invoke(
				fragmentEntryLinkDisplayContext, "getFragmentEntryLinkName",
				new Class<?>[] {FragmentEntryLink.class}, fragmentEntryLink2));
		Assert.assertEquals(
			StringPool.BLANK,
			ReflectionTestUtil.invoke(
				fragmentEntryLinkDisplayContext, "getFragmentEntryLinkName",
				new Class<?>[] {FragmentEntryLink.class}, fragmentEntryLink3));
	}

	@Test
	@TestInfo("LPD-99652")
	public void testGetFragmentEntryLinkTypeLabel() throws Exception {
		FragmentEntry fragmentEntry = _addFragmentEntry();

		Layout layout = LayoutTestUtil.addTypeContentLayout(_group);

		FragmentEntryLink fragmentEntryLink1 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, layout.getPlid());

		FragmentEntryLink fragmentEntryLink2 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry,
				_addLayoutPageTemplateEntryPlid(
					LayoutPageTemplateEntryTypeConstants.BASIC));
		FragmentEntryLink fragmentEntryLink3 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry,
				_addLayoutPageTemplateEntryPlid(
					LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE));
		FragmentEntryLink fragmentEntryLink4 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry,
				_addLayoutPageTemplateEntryPlid(
					LayoutPageTemplateEntryTypeConstants.MASTER_LAYOUT));

		FragmentEntryLink fragmentEntryLink5 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, RandomTestUtil.randomLong());

		Object fragmentEntryLinkDisplayContext =
			_getFragmentEntryLinkDisplayContext(fragmentEntry);

		Assert.assertEquals(
			"page",
			_getFragmentEntryLinkTypeLabel(
				fragmentEntryLinkDisplayContext, fragmentEntryLink1));
		Assert.assertEquals(
			"page-template",
			_getFragmentEntryLinkTypeLabel(
				fragmentEntryLinkDisplayContext, fragmentEntryLink2));
		Assert.assertEquals(
			"display-page-template",
			_getFragmentEntryLinkTypeLabel(
				fragmentEntryLinkDisplayContext, fragmentEntryLink3));
		Assert.assertEquals(
			"master-page",
			_getFragmentEntryLinkTypeLabel(
				fragmentEntryLinkDisplayContext, fragmentEntryLink4));
		Assert.assertEquals(
			StringPool.BLANK,
			_getFragmentEntryLinkTypeLabel(
				fragmentEntryLinkDisplayContext, fragmentEntryLink5));
	}

	@Test
	@TestInfo("LPD-99652")
	public void testGetSearchContainer() throws Exception {
		FragmentEntry fragmentEntry = _addFragmentEntry();

		Layout layout = LayoutTestUtil.addTypeContentLayout(_group);

		FragmentEntryLink fragmentEntryLink1 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, layout.getPlid());

		long missingLayoutPlid = RandomTestUtil.randomLong();

		FragmentEntryLink fragmentEntryLink2 =
			FragmentTestUtil.addFragmentEntryLink(
				fragmentEntry, missingLayoutPlid);

		try (LogCapture logCapture = LoggerTestUtil.configureLog4JLogger(
				_CLASS_NAME, LoggerTestUtil.WARN)) {

			SearchContainer<FragmentEntryLink> searchContainer =
				ReflectionTestUtil.invoke(
					_getFragmentEntryLinkDisplayContext(fragmentEntry),
					"getSearchContainer", new Class<?>[0]);

			List<FragmentEntryLink> fragmentEntryLinks =
				searchContainer.getResults();

			Assert.assertEquals(
				fragmentEntryLinks.toString(), 2, fragmentEntryLinks.size());
			Assert.assertTrue(fragmentEntryLinks.contains(fragmentEntryLink1));
			Assert.assertTrue(fragmentEntryLinks.contains(fragmentEntryLink2));

			Assert.assertEquals(2, searchContainer.getTotal());

			List<LogEntry> logEntries = logCapture.getLogEntries();

			Assert.assertEquals(logEntries.toString(), 1, logEntries.size());

			LogEntry logEntry = logEntries.get(0);

			Assert.assertEquals(
				StringBundler.concat(
					"Fragment entry ", fragmentEntry.getExternalReferenceCode(),
					" references missing layouts ", missingLayoutPlid),
				logEntry.getMessage());
		}
	}

	private FragmentEntry _addFragmentEntry() throws Exception {
		FragmentCollection fragmentCollection =
			FragmentTestUtil.addFragmentCollection(_group.getGroupId());

		return FragmentEntryTestUtil.addFragmentEntry(
			fragmentCollection.getFragmentCollectionId());
	}

	private long _addLayoutPageTemplateEntryPlid(int type) throws Exception {
		LayoutPageTemplateEntry layoutPageTemplateEntry =
			LayoutPageTemplateTestUtil.addLayoutPageTemplateEntry(
				_group.getGroupId(), type, WorkflowConstants.STATUS_APPROVED);

		return layoutPageTemplateEntry.getPlid();
	}

	private Object _getFragmentEntryLinkDisplayContext(
			FragmentEntry fragmentEntry)
		throws Exception {

		return FragmentDisplayContextTestUtil.createDisplayContext(
			_constructor, _group,
			HashMapBuilder.put(
				"fragmentEntryId",
				String.valueOf(fragmentEntry.getFragmentEntryId())
			).build());
	}

	private String _getFragmentEntryLinkTypeLabel(
		Object fragmentEntryLinkDisplayContext,
		FragmentEntryLink fragmentEntryLink) {

		return ReflectionTestUtil.invoke(
			fragmentEntryLinkDisplayContext, "getFragmentEntryLinkTypeLabel",
			new Class<?>[] {FragmentEntryLink.class}, fragmentEntryLink);
	}

	private static final String _CLASS_NAME =
		"com.liferay.fragment.web.internal.display.context." +
			"FragmentEntryLinkDisplayContext";

	private static Constructor<?> _constructor;

	@DeleteAfterTestRun
	private Group _group;

}
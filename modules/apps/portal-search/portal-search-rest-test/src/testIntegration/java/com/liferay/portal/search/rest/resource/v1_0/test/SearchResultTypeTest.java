/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.search.rest.resource.v1_0.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.layout.page.template.constants.LayoutPageTemplateEntryTypeConstants;
import com.liferay.layout.page.template.model.LayoutPageTemplateEntry;
import com.liferay.layout.page.template.test.util.LayoutPageTemplateTestUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.test.TestInfo;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.HTTPTestUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.URLCodec;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.search.test.rule.SearchTestRule;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;

import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Javier Moral
 */
@RunWith(Arquillian.class)
public class SearchResultTypeTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@Before
	public void setUp() throws Exception {
		_group = GroupTestUtil.addGroup();

		LayoutPageTemplateTestUtil.addLayoutPageTemplateEntry(
			_group.getGroupId(),
			LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE,
			WorkflowConstants.STATUS_APPROVED);
		LayoutPageTemplateTestUtil.addLayoutPageTemplateEntry(
			_group.getGroupId(),
			LayoutPageTemplateEntryTypeConstants.MASTER_LAYOUT,
			WorkflowConstants.STATUS_APPROVED);
	}

	@Test
	@TestInfo("LPD-98886")
	public void testGetSearchPageWithTypeFilter() throws Exception {
		JSONObject jsonObject = _getSearchJSONObject();

		Assert.assertEquals(
			jsonObject.toString(), 2, jsonObject.getLong("totalCount"));

		jsonObject = _getSearchJSONObject(
			LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE);

		Assert.assertEquals(
			jsonObject.toString(), 1, jsonObject.getLong("totalCount"));

		jsonObject = _getSearchJSONObject(
			LayoutPageTemplateEntryTypeConstants.MASTER_LAYOUT);

		Assert.assertEquals(
			jsonObject.toString(), 1, jsonObject.getLong("totalCount"));
	}

	@Test
	@TestInfo("LPD-98886")
	public void testGetSearchPageWithTypeInSearchResults() throws Exception {
		JSONObject jsonObject = _getSearchJSONObject();

		Assert.assertEquals(
			jsonObject.toString(),
			Arrays.asList(
				String.valueOf(
					LayoutPageTemplateEntryTypeConstants.DISPLAY_PAGE),
				String.valueOf(
					LayoutPageTemplateEntryTypeConstants.MASTER_LAYOUT)),
			_getTypes(jsonObject));
	}

	@Rule
	public SearchTestRule searchTestRule = new SearchTestRule();

	private String _getSearchEndpoint() {
		return StringBundler.concat(
			"search/v1.0/search?emptySearch=true&entryClassNames=",
			LayoutPageTemplateEntry.class.getName(), "&scope=",
			_group.getGroupId());
	}

	private JSONObject _getSearchJSONObject() throws Exception {
		return HTTPTestUtil.invokeToJSONObject(
			null, _getSearchEndpoint(), Http.Method.GET);
	}

	private JSONObject _getSearchJSONObject(int type) throws Exception {
		return HTTPTestUtil.invokeToJSONObject(
			null,
			StringBundler.concat(
				_getSearchEndpoint(), "&filter=",
				URLCodec.encodeURL(
					StringBundler.concat("type eq '", type, "'"))),
			Http.Method.GET);
	}

	private List<String> _getTypes(JSONObject jsonObject) throws Exception {
		return ListUtil.sort(
			JSONUtil.toList(
				jsonObject.getJSONArray("items"),
				itemJSONObject -> GetterUtil.getString(
					itemJSONObject.get("type"))));
	}

	@DeleteAfterTestRun
	private Group _group;

}
/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.batch.engine.internal.reader;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import com.liferay.batch.engine.BatchEngineTaskOperation;
import com.liferay.batch.engine.model.BatchEngineImportTask;
import com.liferay.batch.engine.model.impl.BatchEngineImportTaskImpl;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.test.rule.LiferayUnitTestRule;

import java.util.Collections;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;

/**
 * @author Georgel Pop
 */
public class PolymorphicDeleteBatchEngineImportTaskItemReaderUtilTest {

	@ClassRule
	@Rule
	public static final LiferayUnitTestRule liferayUnitTestRule =
		LiferayUnitTestRule.INSTANCE;

	@Test
	public void testConvertValueCreateFailsWithoutType() throws Exception {
		try {
			BatchEngineImportTaskItemReaderUtil.convertValue(
				_getBatchEngineImportTask(BatchEngineTaskOperation.CREATE),
				PageTemplate.class,
				Collections.singletonMap(
					"externalReferenceCode", RandomTestUtil.randomString()),
				Collections.emptyList());

			Assert.fail();
		}
		catch (Exception exception) {
		}
	}

	@Test
	public void testConvertValueDeleteResolvesSubtypeWithoutType()
		throws Exception {

		String externalReferenceCode = RandomTestUtil.randomString();

		PageTemplate pageTemplate =
			BatchEngineImportTaskItemReaderUtil.convertValue(
				_getBatchEngineImportTask(BatchEngineTaskOperation.DELETE),
				PageTemplate.class,
				Collections.singletonMap(
					"externalReferenceCode", externalReferenceCode),
				Collections.emptyList());

		Assert.assertTrue(pageTemplate instanceof ContentPageTemplate);
		Assert.assertEquals(
			externalReferenceCode, pageTemplate.getExternalReferenceCode());
	}

	public static class ContentPageTemplate extends PageTemplate {
	}

	@JsonSubTypes(
		{
			@JsonSubTypes.Type(
				name = "ContentPageTemplate", value = ContentPageTemplate.class
			),
			@JsonSubTypes.Type(
				name = "WidgetPageTemplate", value = WidgetPageTemplate.class
			)
		}
	)
	@JsonTypeInfo(
		include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type",
		use = JsonTypeInfo.Id.NAME, visible = true
	)
	public abstract static class PageTemplate {

		public String getExternalReferenceCode() {
			return _externalReferenceCode;
		}

		public void setExternalReferenceCode(String externalReferenceCode) {
			_externalReferenceCode = externalReferenceCode;
		}

		private String _externalReferenceCode;

	}

	public static class WidgetPageTemplate extends PageTemplate {
	}

	private BatchEngineImportTask _getBatchEngineImportTask(
		BatchEngineTaskOperation batchEngineTaskOperation) {

		BatchEngineImportTask batchEngineImportTask =
			new BatchEngineImportTaskImpl();

		batchEngineImportTask.setOperation(batchEngineTaskOperation.name());

		return batchEngineImportTask;
	}

}
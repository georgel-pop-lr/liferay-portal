/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.page.template.model.impl;

import com.liferay.portal.kernel.json.JSONException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.cache.CacheField;

import java.util.Objects;

/**
 * @author Eudaldo Alonso
 */
public class LayoutPageTemplateStructureRelImpl
	extends LayoutPageTemplateStructureRelBaseImpl {

	@Override
	public JSONObject getDataJSONObject() {
		if (_dataJSONObject == null) {
			_dataJSONObject = _updateCachedDataJSONObject();
		}

		return _dataJSONObject;
	}

	@Override
	public void setData(String data) {
		if (Objects.equals(data, getData())) {
			return;
		}

		super.setData(data);

		_dataJSONObject = _updateCachedDataJSONObject();
	}

	private JSONObject _updateCachedDataJSONObject() {
		JSONObject dataJSONObject = null;

		try {
			dataJSONObject = JSONFactoryUtil.createJSONObject(getData());
		}
		catch (JSONException jsonException) {
			if (_log.isDebugEnabled()) {
				_log.debug(jsonException);
			}
		}

		dataJSONObjectUpdateEntityCacheBiConsumer.accept(this, dataJSONObject);

		return dataJSONObject;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		LayoutPageTemplateStructureRelImpl.class);

	@CacheField(permanent = true, propagateToInterface = true)
	private transient JSONObject _dataJSONObject;

}
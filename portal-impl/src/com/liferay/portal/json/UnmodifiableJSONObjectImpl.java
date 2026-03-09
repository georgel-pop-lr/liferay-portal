/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.json;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.Set;

/**
 * @author Brian Wing Shun Chan
 */
public class UnmodifiableJSONObjectImpl extends JSONObjectImpl {

	@Override
	public Iterator<String> keys() {
		return Collections.emptyIterator();
	}

	@Override
	public Set<String> keySet() {
		return Collections.emptySet();
	}

	@Override
	public JSONObject put(String key, boolean value) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, Date value) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, double value) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, int value) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, JSONArray jsonArray) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, JSONObject jsonObject) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, long value) {
		return _warnModification();
	}

	@Override
	public JSONObject put(String key, String value) {
		return _warnModification();
	}

	@Override
	public JSONObject putException(Exception exception) {
		return _warnModification();
	}

	@Override
	public Object remove(String key) {
		_warnModification();

		return null;
	}

	private JSONObject _warnModification() {
		if (_log.isWarnEnabled()) {
			_log.warn(_WARN_MODIFICATIONS);
		}

		return this;
	}

	private static final String _WARN_MODIFICATIONS =
		"Modifications are unsupported";

	private static final Log _log = LogFactoryUtil.getLog(
		UnmodifiableJSONObjectImpl.class);

}
/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.kernel.json;

/**
 * @author Georgel Pop
 */
public final class UnmodifiableJSONUtil {

	/**
	 * Wraps the specified object in an unmodifiable JSON wrapper if it is an
	 * instance of {@link JSONObject} or {@link JSONArray}.
	 *
	 * @param object the object to be wrapped
	 * @return the unmodifiable wrapped object, or the original object if it is
	 * not a JSON structure
	 */
	public static Object wrapUnmodifiableObject(Object object) {
		if (object == null) {
			return null;
		}

		if (object instanceof JSONObject) {
			return new UnmodifiableJSONObjectWrapper((JSONObject)object);
		}

		if (object instanceof JSONArray) {
			return new UnmodifiableJSONArrayWrapper((JSONArray)object);
		}

		return object;
	}

	private UnmodifiableJSONUtil() {
	}

}
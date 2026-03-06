/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.kernel.json;

import com.liferay.petra.function.UnsafeSupplier;

import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import java.io.Writer;

import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * @author Georgel Pop
 */
public final class UnmodifiableJSONObjectWrapper implements JSONObject {

	/**
	 * @deprecated As of Cavanaugh (7.4.x), required for {@link
	 * java.io.Externalizable}. This constructor should not be used directly.
	 */
	@Deprecated
	public UnmodifiableJSONObjectWrapper() {
		_jsonObject = null;
	}

	/**
	 * Constructs a new unmodifiable wrapper for the specified JSON object.
	 *
	 * @param jsonObject the JSON object to be wrapped
	 * @throws IllegalArgumentException if the JSON object is <code>null</code>
	 */
	public UnmodifiableJSONObjectWrapper(JSONObject jsonObject) {
		if (jsonObject == null) {
			throw new IllegalArgumentException(_ERROR_INITIALIZE_NULL);
		}

		_jsonObject = jsonObject;
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (object instanceof UnmodifiableJSONObjectWrapper wrapper) {
			return Objects.equals(_jsonObject, wrapper._jsonObject);
		}

		return Objects.equals(_jsonObject, object);
	}

	@Override
	public Object get(String key) {
		return UnmodifiableJSONUtil.wrapUnmodifiableObject(
			_getJSONObject().get(key));
	}

	@Override
	public boolean getBoolean(String key) {
		return _getJSONObject().getBoolean(key);
	}

	@Override
	public boolean getBoolean(String key, boolean defaultValue) {
		return _getJSONObject().getBoolean(key, defaultValue);
	}

	@Override
	public double getDouble(String key) {
		return _getJSONObject().getDouble(key);
	}

	@Override
	public double getDouble(String key, double defaultValue) {
		return _getJSONObject().getDouble(key, defaultValue);
	}

	@Override
	public int getInt(String key) {
		return _getJSONObject().getInt(key);
	}

	@Override
	public int getInt(String key, int defaultValue) {
		return _getJSONObject().getInt(key, defaultValue);
	}

	@Override
	public JSONArray getJSONArray(String key) {
		JSONArray jsonArray = _getJSONObject().getJSONArray(key);

		if (jsonArray != null) {
			return new UnmodifiableJSONArrayWrapper(jsonArray);
		}

		return null;
	}

	@Override
	public JSONObject getJSONObject(String key) {
		JSONObject jsonObject = _getJSONObject().getJSONObject(key);

		if (jsonObject != null) {
			return new UnmodifiableJSONObjectWrapper(jsonObject);
		}

		return null;
	}

	@Override
	public long getLong(String key) {
		return _getJSONObject().getLong(key);
	}

	@Override
	public long getLong(String key, long defaultValue) {
		return _getJSONObject().getLong(key, defaultValue);
	}

	@Override
	public String getString(String key) {
		return _getJSONObject().getString(key);
	}

	@Override
	public String getString(String key, String defaultValue) {
		return _getJSONObject().getString(key, defaultValue);
	}

	@Override
	public boolean has(String key) {
		return _getJSONObject().has(key);
	}

	@Override
	public int hashCode() {
		if (_jsonObject == null) {
			return 0;
		}

		return _jsonObject.hashCode();
	}

	@Override
	public boolean isNull(String key) {
		return _getJSONObject().isNull(key);
	}

	@Override
	public Iterator<String> keys() {
		return Collections.unmodifiableSet(
			_getJSONObject().keySet()
		).iterator();
	}

	@Override
	public Set<String> keySet() {
		return Collections.unmodifiableSet(_getJSONObject().keySet());
	}

	@Override
	public int length() {
		if (_jsonObject == null) {
			return 0;
		}

		return _jsonObject.length();
	}

	@Override
	public JSONArray names() {
		JSONArray jsonArray = _getJSONObject().names();

		if (jsonArray == null) {
			return null;
		}

		return new UnmodifiableJSONArrayWrapper(jsonArray);
	}

	@Override
	public Object opt(String key) {
		return UnmodifiableJSONUtil.wrapUnmodifiableObject(
			_getJSONObject().opt(key));
	}

	@Override
	public JSONObject put(String key, boolean value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, Date value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, double value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, int value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, JSONArray jsonArray) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, JSONObject jsonObject) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, long value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, Object value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(String key, String value) {
		return _blockModification();
	}

	@Override
	public JSONObject put(
		String key, UnsafeSupplier<Object, Exception> valueUnsafeSupplier) {

		return _blockModification();
	}

	@Override
	public JSONObject putException(Exception exception) {
		return _blockModification();
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		throw new UnsupportedOperationException(_ERROR_DESERIALIZE);
	}

	@Override
	public Object remove(String key) {
		throw new UnsupportedOperationException(_ERROR_UNMODIFIABLE);
	}

	@Override
	public String toJSONString() {
		return toString();
	}

	@Override
	public Map<String, Object> toMap() {
		return Collections.unmodifiableMap(_getJSONObject().toMap());
	}

	@Override
	public String toString() {
		if (_jsonObject == null) {
			return _EMPTY_JSON_OBJECT;
		}

		return _jsonObject.toString();
	}

	@Override
	public String toString(int indentFactor) throws JSONException {
		if (_jsonObject == null) {
			return _EMPTY_JSON_OBJECT;
		}

		return _jsonObject.toString(indentFactor);
	}

	@Override
	public Writer write(Writer writer) throws JSONException {
		if (_jsonObject == null) {
			try {
				return writer.append(_EMPTY_JSON_OBJECT);
			}
			catch (IOException ioException) {
				throw new JSONException(ioException);
			}
		}

		return _jsonObject.write(writer);
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		if (_jsonObject != null) {
			_jsonObject.writeExternal(objectOutput);
		}
	}

	private JSONObject _blockModification() {
		throw new UnsupportedOperationException(_ERROR_UNMODIFIABLE);
	}

	private JSONObject _getJSONObject() {
		if (_jsonObject == null) {
			throw new IllegalStateException(_ERROR_NOT_INITIALIZED);
		}

		return _jsonObject;
	}

	private static final String _EMPTY_JSON_OBJECT = "{}";

	private static final String _ERROR_DESERIALIZE =
		"Cannot deserialize into an unmodifiable wrapper";

	private static final String _ERROR_INITIALIZE_NULL =
		"JSONObject cannot be null";

	private static final String _ERROR_NOT_INITIALIZED =
		"JSONObject is not initialized";

	private static final String _ERROR_UNMODIFIABLE =
		"This JSONObject is unmodifiable";

	private final JSONObject _jsonObject;

}
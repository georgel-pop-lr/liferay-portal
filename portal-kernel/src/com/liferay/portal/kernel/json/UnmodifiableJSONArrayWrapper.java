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

import java.util.Iterator;
import java.util.Objects;

/**
 * @author Georgel Pop
 */
public final class UnmodifiableJSONArrayWrapper implements JSONArray {

	/**
	 * @deprecated As of Cavanaugh (7.4.x), required for {@link
	 * java.io.Externalizable}. This constructor should not be used directly.
	 */
	@Deprecated
	public UnmodifiableJSONArrayWrapper() {
		_jsonArray = null;
	}

	/**
	 * Constructs a new unmodifiable wrapper for the specified JSON array.
	 *
	 * @param jsonArray the JSON array to be wrapped
	 * @throws IllegalArgumentException if the JSON array is <code>null</code>
	 */
	public UnmodifiableJSONArrayWrapper(JSONArray jsonArray) {
		if (jsonArray == null) {
			throw new IllegalArgumentException(_ERROR_INITIALIZE_NULL);
		}

		_jsonArray = jsonArray;
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (object instanceof UnmodifiableJSONArrayWrapper wrapper) {
			return Objects.equals(_jsonArray, wrapper._jsonArray);
		}

		return Objects.equals(_jsonArray, object);
	}

	@Override
	public Object get(int index) {
		return UnmodifiableJSONUtil.wrapUnmodifiableObject(
			_getJSONArray().get(index));
	}

	@Override
	public boolean getBoolean(int index) {
		return _getJSONArray().getBoolean(index);
	}

	@Override
	public double getDouble(int index) {
		return _getJSONArray().getDouble(index);
	}

	@Override
	public int getInt(int index) {
		return _getJSONArray().getInt(index);
	}

	@Override
	public JSONArray getJSONArray(int index) {
		JSONArray jsonArray = _getJSONArray().getJSONArray(index);

		if (jsonArray != null) {
			return new UnmodifiableJSONArrayWrapper(jsonArray);
		}

		return null;
	}

	@Override
	public JSONObject getJSONObject(int index) {
		JSONObject jsonObject = _getJSONArray().getJSONObject(index);

		if (jsonObject != null) {
			return new UnmodifiableJSONObjectWrapper(jsonObject);
		}

		return null;
	}

	@Override
	public long getLong(int index) {
		return _getJSONArray().getLong(index);
	}

	@Override
	public String getString(int index) {
		return _getJSONArray().getString(index);
	}

	@Override
	public int hashCode() {
		if (_jsonArray == null) {
			return 0;
		}

		return _jsonArray.hashCode();
	}

	@Override
	public boolean isNull(int index) {
		return _getJSONArray().isNull(index);
	}

	@Override
	@SuppressWarnings("unchecked")
	public Iterator<Object> iterator() {
		final Iterator<Object> originalIterator = _getJSONArray().iterator();

		return new Iterator<Object>() {

			@Override
			public boolean hasNext() {
				return originalIterator.hasNext();
			}

			@Override
			public Object next() {
				return UnmodifiableJSONUtil.wrapUnmodifiableObject(
					originalIterator.next());
			}

			@Override
			public void remove() {
				_blockModification();
			}

		};
	}

	@Override
	public String join(String separator) throws JSONException {
		return _getJSONArray().join(separator);
	}

	@Override
	public int length() {
		if (_jsonArray == null) {
			return 0;
		}

		return _jsonArray.length();
	}

	@Override
	public JSONArray put(boolean value) {
		return _blockModification();
	}

	@Override
	public JSONArray put(double value) {
		return _blockModification();
	}

	@Override
	public JSONArray put(int value) {
		return _blockModification();
	}

	@Override
	public JSONArray put(JSONArray jsonArray) {
		return _blockModification();
	}

	@Override
	public JSONArray put(JSONObject jsonObject) {
		return _blockModification();
	}

	@Override
	public JSONArray put(long value) {
		return _blockModification();
	}

	@Override
	public JSONArray put(Object value) {
		return _blockModification();
	}

	@Override
	public JSONArray put(String value) {
		return _blockModification();
	}

	@Override
	public JSONArray put(
		UnsafeSupplier<Object, Exception> valueUnsafeSupplier) {

		return _blockModification();
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		throw new UnsupportedOperationException(_ERROR_DESERIALIZE);
	}

	@Override
	public String toJSONString() {
		return toString();
	}

	@Override
	public String toString() {
		if (_jsonArray == null) {
			return _EMPTY_JSON_ARRAY;
		}

		return _jsonArray.toString();
	}

	@Override
	public String toString(int indentFactor) throws JSONException {
		if (_jsonArray == null) {
			return _EMPTY_JSON_ARRAY;
		}

		return _jsonArray.toString(indentFactor);
	}

	@Override
	public Writer write(Writer writer) throws JSONException {
		if (_jsonArray == null) {
			try {
				return writer.append(_EMPTY_JSON_ARRAY);
			}
			catch (IOException ioException) {
				throw new JSONException(ioException);
			}
		}

		return _jsonArray.write(writer);
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		if (_jsonArray != null) {
			_jsonArray.writeExternal(objectOutput);
		}
	}

	private JSONArray _blockModification() {
		throw new UnsupportedOperationException(_ERROR_UNMODIFIABLE);
	}

	private JSONArray _getJSONArray() {
		if (_jsonArray == null) {
			throw new IllegalStateException(_ERROR_NOT_INITIALIZED);
		}

		return _jsonArray;
	}

	private static final String _EMPTY_JSON_ARRAY = "[]";

	private static final String _ERROR_DESERIALIZE =
		"Cannot deserialize into an unmodifiable wrapper";

	private static final String _ERROR_INITIALIZE_NULL =
		"JSONArray cannot be null";

	private static final String _ERROR_NOT_INITIALIZED =
		"JSONArray is not initialized";

	private static final String _ERROR_UNMODIFIABLE =
		"This JSONArray is unmodifiable";

	private final JSONArray _jsonArray;

}
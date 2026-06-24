/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.admin.site.dto.v1_0;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.util.ObjectMapperUtil;

import jakarta.annotation.Generated;

import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;

/**
 * @author Rubén Pulido
 * @generated
 */
@Generated("")
@GraphQLName(
	description = "The site pages variation and version a page was last published from. It is populated only while a page is being published through staging.",
	value = "LastPublishInformation"
)
@io.swagger.v3.oas.annotations.media.Schema(
	description = "The site pages variation and version a page was last published from. It is populated only while a page is being published through staging."
)
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "LastPublishInformation")
public class LastPublishInformation implements Serializable {

	public static LastPublishInformation toDTO(String json) {
		return ObjectMapperUtil.readValue(LastPublishInformation.class, json);
	}

	public static LastPublishInformation unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			LastPublishInformation.class, json);
	}

	@io.swagger.v3.oas.annotations.media.Schema(
		description = "The identifier of the published page version."
	)
	public Long getLayoutRevisionId() {
		if (_layoutRevisionIdSupplier != null) {
			layoutRevisionId = _layoutRevisionIdSupplier.get();

			_layoutRevisionIdSupplier = null;
		}

		return layoutRevisionId;
	}

	public void setLayoutRevisionId(Long layoutRevisionId) {
		this.layoutRevisionId = layoutRevisionId;

		_layoutRevisionIdSupplier = null;
	}

	@JsonIgnore
	public void setLayoutRevisionId(
		UnsafeSupplier<Long, Exception> layoutRevisionIdUnsafeSupplier) {

		_layoutRevisionIdSupplier = () -> {
			try {
				return layoutRevisionIdUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField(description = "The identifier of the published page version.")
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected Long layoutRevisionId;

	@JsonIgnore
	private Supplier<Long> _layoutRevisionIdSupplier;

	@io.swagger.v3.oas.annotations.media.Schema(
		description = "The name of the published site pages variation."
	)
	public String getLayoutSetBranchName() {
		if (_layoutSetBranchNameSupplier != null) {
			layoutSetBranchName = _layoutSetBranchNameSupplier.get();

			_layoutSetBranchNameSupplier = null;
		}

		return layoutSetBranchName;
	}

	public void setLayoutSetBranchName(String layoutSetBranchName) {
		this.layoutSetBranchName = layoutSetBranchName;

		_layoutSetBranchNameSupplier = null;
	}

	@JsonIgnore
	public void setLayoutSetBranchName(
		UnsafeSupplier<String, Exception> layoutSetBranchNameUnsafeSupplier) {

		_layoutSetBranchNameSupplier = () -> {
			try {
				return layoutSetBranchNameUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField(
		description = "The name of the published site pages variation."
	)
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String layoutSetBranchName;

	@JsonIgnore
	private Supplier<String> _layoutSetBranchNameSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof LastPublishInformation)) {
			return false;
		}

		LastPublishInformation lastPublishInformation =
			(LastPublishInformation)object;

		return Objects.equals(toString(), lastPublishInformation.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		Long layoutRevisionId = getLayoutRevisionId();

		if (layoutRevisionId != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"layoutRevisionId\": ");

			sb.append(layoutRevisionId);
		}

		String layoutSetBranchName = getLayoutSetBranchName();

		if (layoutSetBranchName != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"layoutSetBranchName\": ");

			sb.append("\"");

			sb.append(_escape(layoutSetBranchName));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	@io.swagger.v3.oas.annotations.media.Schema(
		accessMode = io.swagger.v3.oas.annotations.media.Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.headless.admin.site.dto.v1_0.LastPublishInformation",
		name = "x-class-name"
	)
	public String xClassName;

	private static String _escape(Object object) {
		return StringUtil.replace(
			String.valueOf(object), _JSON_ESCAPE_STRINGS[0],
			_JSON_ESCAPE_STRINGS[1]);
	}

	private static boolean _isArray(Object value) {
		if (value == null) {
			return false;
		}

		Class<?> clazz = value.getClass();

		return clazz.isArray();
	}

	private static String _toJSON(Map<String, ?> map) {
		StringBuilder sb = new StringBuilder("{");

		@SuppressWarnings("unchecked")
		Set set = map.entrySet();

		@SuppressWarnings("unchecked")
		Iterator<Map.Entry<String, ?>> iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry<String, ?> entry = iterator.next();

			sb.append("\"");
			sb.append(_escape(entry.getKey()));
			sb.append("\": ");

			Object value = entry.getValue();

			if (_isArray(value)) {
				sb.append("[");

				Object[] valueArray = (Object[])value;

				for (int i = 0; i < valueArray.length; i++) {
					if (valueArray[i] instanceof Map) {
						sb.append(_toJSON((Map<String, ?>)valueArray[i]));
					}
					else if (valueArray[i] instanceof String) {
						sb.append("\"");
						sb.append(valueArray[i]);
						sb.append("\"");
					}
					else {
						sb.append(valueArray[i]);
					}

					if ((i + 1) < valueArray.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof Map) {
				sb.append(_toJSON((Map<String, ?>)value));
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(value));
				sb.append("\"");
			}
			else {
				sb.append(value);
			}

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

	private static final String[][] _JSON_ESCAPE_STRINGS = {
		{"\\", "\"", "\b", "\f", "\n", "\r", "\t"},
		{"\\\\", "\\\"", "\\b", "\\f", "\\n", "\\r", "\\t"}
	};

	private Map<String, Serializable> _extendedProperties;

}
// LIFERAY-REST-BUILDER-HASH:1622666992
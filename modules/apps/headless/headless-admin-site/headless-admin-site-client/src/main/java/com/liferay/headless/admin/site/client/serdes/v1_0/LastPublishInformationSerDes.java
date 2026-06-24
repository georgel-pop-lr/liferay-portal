/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.admin.site.client.serdes.v1_0;

import com.liferay.headless.admin.site.client.dto.v1_0.LastPublishInformation;
import com.liferay.headless.admin.site.client.json.BaseJSONParser;

import jakarta.annotation.Generated;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;

/**
 * @author Rubén Pulido
 * @generated
 */
@Generated("")
public class LastPublishInformationSerDes {

	public static LastPublishInformation toDTO(String json) {
		LastPublishInformationJSONParser lastPublishInformationJSONParser =
			new LastPublishInformationJSONParser();

		return lastPublishInformationJSONParser.parseToDTO(json);
	}

	public static LastPublishInformation[] toDTOs(String json) {
		LastPublishInformationJSONParser lastPublishInformationJSONParser =
			new LastPublishInformationJSONParser();

		return lastPublishInformationJSONParser.parseToDTOs(json);
	}

	public static String toJSON(LastPublishInformation lastPublishInformation) {
		if (lastPublishInformation == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (lastPublishInformation.getLayoutRevisionId() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"layoutRevisionId\": ");

			sb.append(lastPublishInformation.getLayoutRevisionId());
		}

		if (lastPublishInformation.getLayoutSetBranchName() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"layoutSetBranchName\": ");

			sb.append("\"");

			sb.append(_escape(lastPublishInformation.getLayoutSetBranchName()));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		LastPublishInformationJSONParser lastPublishInformationJSONParser =
			new LastPublishInformationJSONParser();

		return lastPublishInformationJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(
		LastPublishInformation lastPublishInformation) {

		if (lastPublishInformation == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (lastPublishInformation.getLayoutRevisionId() == null) {
			map.put("layoutRevisionId", null);
		}
		else {
			map.put(
				"layoutRevisionId",
				String.valueOf(lastPublishInformation.getLayoutRevisionId()));
		}

		if (lastPublishInformation.getLayoutSetBranchName() == null) {
			map.put("layoutSetBranchName", null);
		}
		else {
			map.put(
				"layoutSetBranchName",
				String.valueOf(
					lastPublishInformation.getLayoutSetBranchName()));
		}

		return map;
	}

	public static class LastPublishInformationJSONParser
		extends BaseJSONParser<LastPublishInformation> {

		@Override
		protected LastPublishInformation createDTO() {
			return new LastPublishInformation();
		}

		@Override
		protected LastPublishInformation[] createDTOArray(int size) {
			return new LastPublishInformation[size];
		}

		@Override
		protected boolean parseMaps(String jsonParserFieldName) {
			if (Objects.equals(jsonParserFieldName, "layoutRevisionId")) {
				return false;
			}
			else if (Objects.equals(
						jsonParserFieldName, "layoutSetBranchName")) {

				return false;
			}

			return false;
		}

		@Override
		protected void setField(
			LastPublishInformation lastPublishInformation,
			String jsonParserFieldName, Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "layoutRevisionId")) {
				if (jsonParserFieldValue != null) {
					lastPublishInformation.setLayoutRevisionId(
						Long.valueOf((String)jsonParserFieldValue));
				}
			}
			else if (Objects.equals(
						jsonParserFieldName, "layoutSetBranchName")) {

				if (jsonParserFieldValue != null) {
					lastPublishInformation.setLayoutSetBranchName(
						(String)jsonParserFieldValue);
				}
			}
		}

	}

	private static String _escape(Object object) {
		String string = String.valueOf(object);

		for (String[] strings : BaseJSONParser.JSON_ESCAPE_STRINGS) {
			string = string.replace(strings[0], strings[1]);
		}

		return string;
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
			sb.append(entry.getKey());
			sb.append("\": ");

			Object value = entry.getValue();

			sb.append(_toJSON(value));

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

	private static String _toJSON(Object value) {
		if (value == null) {
			return "null";
		}

		if (value instanceof Map) {
			return _toJSON((Map)value);
		}

		Class<?> clazz = value.getClass();

		if (clazz.isArray()) {
			StringBuilder sb = new StringBuilder("[");

			Object[] values = (Object[])value;

			for (int i = 0; i < values.length; i++) {
				sb.append(_toJSON(values[i]));

				if ((i + 1) < values.length) {
					sb.append(", ");
				}
			}

			sb.append("]");

			return sb.toString();
		}

		if (value instanceof String) {
			return "\"" + _escape(value) + "\"";
		}

		return String.valueOf(value);
	}

}
// LIFERAY-REST-BUILDER-HASH:1540979310
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.adaptive.media;

import com.liferay.petra.string.StringPool;

/**
 * @author Pavel Savinov
 */
public interface LayoutAdaptiveMediaProcessor {

	public default String getBackgroundImageCSS(
		String cssSelector, long fileEntryId) {

		return StringPool.BLANK;
	}

	public String processAdaptiveMediaContent(String content);

}
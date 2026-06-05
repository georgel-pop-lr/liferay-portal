/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.segments.web.internal.servlet.taglib;

import com.liferay.analytics.settings.rest.manager.AnalyticsSettingsManager;
import com.liferay.portal.kernel.feature.flag.FeatureFlagManagerUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.servlet.taglib.BaseDynamicInclude;
import com.liferay.portal.kernel.servlet.taglib.DynamicInclude;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.segments.constants.SegmentsExperienceConstants;
import com.liferay.segments.manager.SegmentsExperienceManager;
import com.liferay.segments.model.SegmentsExperience;
import com.liferay.segments.service.SegmentsExperienceLocalService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Georgel Pop
 */
@Component(service = DynamicInclude.class)
public class SegmentsExperienceTopHeadDynamicInclude
	extends BaseDynamicInclude {

	@Override
	public void include(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String key)
		throws IOException {

		ThemeDisplay themeDisplay =
			(ThemeDisplay)httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		if ((themeDisplay == null) || !themeDisplay.isLifecycleRender() ||
			!FeatureFlagManagerUtil.isEnabled(
				themeDisplay.getCompanyId(), "LPD-81914")) {

			return;
		}

		Layout layout = themeDisplay.getLayout();

		if ((layout == null) || layout.isTypeControlPanel() ||
			(!layout.isTypeAssetDisplay() && !layout.isTypeContent())) {

			return;
		}

		if (!_isAnalyticsEnabled(themeDisplay.getCompanyId())) {
			return;
		}

		PrintWriter printWriter = httpServletResponse.getWriter();

		printWriter.print("<meta content=\"");
		printWriter.print(
			HtmlUtil.escapeAttribute(
				_getSegmentsExperienceKey(httpServletRequest)));
		printWriter.print("\" name=\"page-experience-key\" />");
	}

	@Override
	public void register(DynamicIncludeRegistry dynamicIncludeRegistry) {
		dynamicIncludeRegistry.register("/html/common/themes/top_head.jsp#pre");
	}

	private String _getSegmentsExperienceKey(
		HttpServletRequest httpServletRequest) {

		try {
			SegmentsExperienceManager segmentsExperienceManager =
				new SegmentsExperienceManager(_segmentsExperienceLocalService);

			long segmentsExperienceId =
				segmentsExperienceManager.getSegmentsExperienceId(
					httpServletRequest);

			if (segmentsExperienceId !=
					SegmentsExperienceConstants.ID_DEFAULT) {

				SegmentsExperience segmentsExperience =
					_segmentsExperienceLocalService.fetchSegmentsExperience(
						segmentsExperienceId);

				if (segmentsExperience != null) {
					return segmentsExperience.getSegmentsExperienceKey();
				}
			}
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}
		}

		return SegmentsExperienceConstants.KEY_DEFAULT;
	}

	private boolean _isAnalyticsEnabled(long companyId) {
		try {
			return _analyticsSettingsManager.isAnalyticsEnabled(companyId);
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}

			return false;
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		SegmentsExperienceTopHeadDynamicInclude.class);

	@Reference
	private AnalyticsSettingsManager _analyticsSettingsManager;

	@Reference
	private SegmentsExperienceLocalService _segmentsExperienceLocalService;

}
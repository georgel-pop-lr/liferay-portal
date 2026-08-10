/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.test.rule;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.test.rule.ClassTestRule;
import com.liferay.portal.kernel.test.util.CompanyTestUtil;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.PrefsPropsUtil;
import com.liferay.portal.kernel.util.PropsKeys;
import com.liferay.portal.kernel.util.PropsValues;
import com.liferay.portal.kernel.util.StringUtil;

import jakarta.portlet.PortletPreferences;

import org.junit.runner.Description;

/**
 * @author Jonathan McCann
 */
public class LanguageIdsTestRule extends ClassTestRule<Void> {

	public static final LanguageIdsTestRule INSTANCE =
		new LanguageIdsTestRule();

	@Override
	protected void afterClass(Description description, Void v)
		throws Throwable {

		LanguageIds languageIds = description.getAnnotation(LanguageIds.class);

		if (languageIds == null) {
			return;
		}

		try {
			_setCompanyLocales(
				_originalAvailableLanguageIds, _originalDefaultLanguageId,
				_originalLocalesEnabled);
		}
		finally {
			if (_originalAvailableLanguageIds == null) {
				_unsetCompanyLocales();
			}
		}
	}

	@Override
	protected Void beforeClass(Description description) throws Throwable {
		LanguageIds languageIds = description.getAnnotation(LanguageIds.class);

		if (languageIds == null) {
			return null;
		}

		PortletPreferences portletPreferences = PrefsPropsUtil.getPreferences(
			PortalUtil.getDefaultCompanyId());

		_originalAvailableLanguageIds = portletPreferences.getValue(
			PropsKeys.LOCALES, null);

		_originalDefaultLanguageId = LocaleUtil.toLanguageId(
			LocaleUtil.getDefault());
		_originalLocalesEnabled = PropsValues.LOCALES_ENABLED;

		_setCompanyLocales(
			ArrayUtil.toString(
				languageIds.availableLanguageIds(), StringPool.BLANK),
			languageIds.defaultLanguageId(),
			languageIds.availableLanguageIds());

		return null;
	}

	private void _setCompanyLocales(
			String availableLanguageIds, String defaultLanguageId,
			String[] localesEnabled)
		throws Exception {

		LanguageUtil.init();

		if (availableLanguageIds == null) {
			availableLanguageIds = StringUtil.merge(localesEnabled);
		}

		CompanyTestUtil.resetCompanyLocales(
			PortalUtil.getDefaultCompanyId(), availableLanguageIds,
			defaultLanguageId);

		PropsValues.LOCALES_ENABLED = localesEnabled;
	}

	private void _unsetCompanyLocales() throws Exception {
		long companyId = PortalUtil.getDefaultCompanyId();

		PortletPreferences portletPreferences = PrefsPropsUtil.getPreferences(
			companyId);

		portletPreferences.reset(PropsKeys.LOCALES);

		portletPreferences.store();

		LanguageUtil.resetAvailableLocales(companyId);
	}

	private String _originalAvailableLanguageIds;
	private String _originalDefaultLanguageId;
	private String[] _originalLocalesEnabled;

}
/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.util.test.rule;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.VirtualHost;
import com.liferay.portal.kernel.service.VirtualHostLocalServiceUtil;
import com.liferay.portal.kernel.test.rule.ClassTestRule;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.util.GetterUtil;

import java.util.TreeMap;

import org.junit.runner.Description;

/**
 * @author Georgel Pop
 */
public class CompanyVirtualHostTestRule
	extends ClassTestRule<TreeMap<String, String>> {

	public static final CompanyVirtualHostTestRule INSTANCE =
		new CompanyVirtualHostTestRule();

	@Override
	protected void afterClass(
			Description description, TreeMap<String, String> virtualHostnames)
		throws PortalException {

		VirtualHostLocalServiceUtil.updateVirtualHosts(
			TestPropsValues.getCompanyId(), 0, virtualHostnames);
	}

	@Override
	protected TreeMap<String, String> beforeClass(Description description)
		throws PortalException {

		TreeMap<String, String> virtualHostnames = new TreeMap<>();

		for (VirtualHost virtualHost :
				VirtualHostLocalServiceUtil.getVirtualHosts(
					TestPropsValues.getCompanyId(), 0)) {

			virtualHostnames.put(
				virtualHost.getHostname(),
				GetterUtil.getString(virtualHost.getLanguageId()));
		}

		return virtualHostnames;
	}

	private CompanyVirtualHostTestRule() {
	}

}
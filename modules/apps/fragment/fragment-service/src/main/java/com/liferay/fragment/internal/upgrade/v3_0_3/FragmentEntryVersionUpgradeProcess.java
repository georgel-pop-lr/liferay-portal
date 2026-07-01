/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.fragment.internal.upgrade.v3_0_3;

import com.liferay.fragment.service.FragmentEntryLocalService;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;

/**
 * @author Georgel Pop
 */
public class FragmentEntryVersionUpgradeProcess extends UpgradeProcess {

	public FragmentEntryVersionUpgradeProcess(
		FragmentEntryLocalService fragmentEntryLocalService) {

		_fragmentEntryLocalService = fragmentEntryLocalService;
	}

	@Override
	protected void doUpgrade() throws Exception {
		_fragmentEntryLocalService.cleanUpFragmentEntryVersions();
	}

	private final FragmentEntryLocalService _fragmentEntryLocalService;

}
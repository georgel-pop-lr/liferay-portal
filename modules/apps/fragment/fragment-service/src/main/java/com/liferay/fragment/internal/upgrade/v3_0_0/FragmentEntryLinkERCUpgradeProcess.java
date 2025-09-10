/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.fragment.internal.upgrade.v3_0_0;

import com.liferay.fragment.model.impl.FragmentEntryLinkModelImpl;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;
import com.liferay.portal.kernel.upgrade.UpgradeProcessFactory;
import com.liferay.portal.kernel.upgrade.UpgradeStep;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * @author Georgel Pop
 */
public class FragmentEntryLinkERCUpgradeProcess extends UpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		if (hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"originalFragmentEntryLinkId") &&
			hasColumn(
				FragmentEntryLinkModelImpl.TABLE_NAME, "fragmentEntryId")) {

			try (PreparedStatement preparedStatement =
					connection.prepareStatement(
						StringBundler.concat(
							"SELECT FragmentEntryLink1.ctCollectionId, ",
							"FragmentEntryLink1.fragmentEntryLinkId, ",
							"FragmentEntryLink1.groupId, ",
							"FragmentEntry.groupId AS fragmentEntryGroupId, ",
							"FragmentEntryLink2.externalReferenceCode AS ",
							"originalFragmentEntryLinkERC, ",
							"FragmentEntry.externalReferenceCode AS ",
							"fragmentEntryERC, Group_.externalReferenceCode ",
							"AS fragmentEntryScopeERC FROM FragmentEntryLink ",
							"AS FragmentEntryLink1 LEFT JOIN ",
							"FragmentEntryLink AS FragmentEntryLink2 ON ",
							"FragmentEntryLink1.originalFragmentEntryLinkId = ",
							"FragmentEntryLink2.fragmentEntryLinkId AND ",
							"FragmentEntryLink1.ctCollectionId = ",
							"FragmentEntryLink2.ctCollectionId LEFT JOIN ",
							"FragmentEntry ON ",
							"FragmentEntryLink1.fragmentEntryId = ",
							"FragmentEntry.fragmentEntryId LEFT JOIN Group_ ",
							"ON FragmentEntry.groupId = Group_.groupId"))) {

				try (ResultSet resultSet = preparedStatement.executeQuery()) {
					while (resultSet.next()) {
						String fragmentEntryERC = resultSet.getString(
							"fragmentEntryERC");
						long fragmentEntryGroupId = resultSet.getLong(
							"fragmentEntryGroupId");
						long fragmentEntryLinkGroupId = resultSet.getLong(
							"groupId");
						String fragmentEntryScopeERC = resultSet.getString(
							"fragmentEntryScopeERC");
						long ctCollectionId = resultSet.getLong(
							"ctCollectionId");
						long fragmentEntryLinkId = resultSet.getLong(
							"fragmentEntryLinkId");
						String originalFragmentEntryLinkERC =
							resultSet.getString("originalFragmentEntryLinkERC");

						if ((fragmentEntryERC == null) ||
							(fragmentEntryGroupId ==
								fragmentEntryLinkGroupId)) {

							fragmentEntryScopeERC = null;
						}

						_updateERCColumns(
							ctCollectionId, fragmentEntryERC,
							fragmentEntryLinkId, fragmentEntryScopeERC,
							originalFragmentEntryLinkERC);
					}
				}
			}
			catch (Exception exception) {
				if (_log.isDebugEnabled()) {
					_log.debug(exception);
				}
			}
		}
	}

	@Override
	protected UpgradeStep[] getPostUpgradeSteps() {
		return new UpgradeStep[] {
			UpgradeProcessFactory.dropColumns(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"originalFragmentEntryLinkId", "fragmentEntryId")
		};
	}

	@Override
	protected UpgradeStep[] getPreUpgradeSteps() {
		return new UpgradeStep[] {
			UpgradeProcessFactory.addColumns(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"originalFragmentEntryLinkERC VARCHAR(75) null"),
			UpgradeProcessFactory.addColumns(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"fragmentEntryERC VARCHAR(75) null"),
			UpgradeProcessFactory.addColumns(
				FragmentEntryLinkModelImpl.TABLE_NAME,
				"fragmentEntryScopeERC VARCHAR(75) null")
		};
	}

	private void _updateERCColumns(
		long ctCollectionId, String fragmentEntryERC, long fragmentEntryLinkId,
		String fragmentEntryScopeERC, String originalFragmentEntryLinkERC) {

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				StringBundler.concat(
					"UPDATE ", FragmentEntryLinkModelImpl.TABLE_NAME,
					" SET fragmentEntryERC = ?, fragmentEntryScopeERC = ?, ",
					"originalFragmentEntryLinkERC = ?  WHERE ctCollectionId = ",
					"? AND fragmentEntryLinkId = ?"))) {

			preparedStatement.setString(1, fragmentEntryERC);
			preparedStatement.setString(2, fragmentEntryScopeERC);
			preparedStatement.setString(3, originalFragmentEntryLinkERC);
			preparedStatement.setLong(4, ctCollectionId);
			preparedStatement.setLong(5, fragmentEntryLinkId);

			preparedStatement.executeUpdate();
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		FragmentEntryLinkERCUpgradeProcess.class);

}
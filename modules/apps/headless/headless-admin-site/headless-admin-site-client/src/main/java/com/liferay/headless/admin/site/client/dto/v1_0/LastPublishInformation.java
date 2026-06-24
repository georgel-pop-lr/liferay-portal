/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.admin.site.client.dto.v1_0;

import com.liferay.headless.admin.site.client.function.UnsafeSupplier;
import com.liferay.headless.admin.site.client.serdes.v1_0.LastPublishInformationSerDes;

import jakarta.annotation.Generated;

import java.io.Serializable;

import java.util.Objects;

/**
 * @author Rubén Pulido
 * @generated
 */
@Generated("")
public class LastPublishInformation implements Cloneable, Serializable {

	public static LastPublishInformation toDTO(String json) {
		return LastPublishInformationSerDes.toDTO(json);
	}

	public Long getLayoutBranchId() {
		return layoutBranchId;
	}

	public void setLayoutBranchId(Long layoutBranchId) {
		this.layoutBranchId = layoutBranchId;
	}

	public void setLayoutBranchId(
		UnsafeSupplier<Long, Exception> layoutBranchIdUnsafeSupplier) {

		try {
			layoutBranchId = layoutBranchIdUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected Long layoutBranchId;

	public String getLayoutBranchName() {
		return layoutBranchName;
	}

	public void setLayoutBranchName(String layoutBranchName) {
		this.layoutBranchName = layoutBranchName;
	}

	public void setLayoutBranchName(
		UnsafeSupplier<String, Exception> layoutBranchNameUnsafeSupplier) {

		try {
			layoutBranchName = layoutBranchNameUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String layoutBranchName;

	public Long getLayoutRevisionId() {
		return layoutRevisionId;
	}

	public void setLayoutRevisionId(Long layoutRevisionId) {
		this.layoutRevisionId = layoutRevisionId;
	}

	public void setLayoutRevisionId(
		UnsafeSupplier<Long, Exception> layoutRevisionIdUnsafeSupplier) {

		try {
			layoutRevisionId = layoutRevisionIdUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected Long layoutRevisionId;

	public Long getLayoutSetBranchId() {
		return layoutSetBranchId;
	}

	public void setLayoutSetBranchId(Long layoutSetBranchId) {
		this.layoutSetBranchId = layoutSetBranchId;
	}

	public void setLayoutSetBranchId(
		UnsafeSupplier<Long, Exception> layoutSetBranchIdUnsafeSupplier) {

		try {
			layoutSetBranchId = layoutSetBranchIdUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected Long layoutSetBranchId;

	public String getLayoutSetBranchName() {
		return layoutSetBranchName;
	}

	public void setLayoutSetBranchName(String layoutSetBranchName) {
		this.layoutSetBranchName = layoutSetBranchName;
	}

	public void setLayoutSetBranchName(
		UnsafeSupplier<String, Exception> layoutSetBranchNameUnsafeSupplier) {

		try {
			layoutSetBranchName = layoutSetBranchNameUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String layoutSetBranchName;

	@Override
	public LastPublishInformation clone() throws CloneNotSupportedException {
		return (LastPublishInformation)super.clone();
	}

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
		return LastPublishInformationSerDes.toJSON(this);
	}

}
// LIFERAY-REST-BUILDER-HASH:850513638
/* eslint-disable no-console */

/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {
	Marketplace,
	MarketplaceRest,
	MarketplaceView,
	Product,
	useMarketplaceContext,
} from '@liferay/marketplace-js-components-web';
import React, {useState} from 'react';

import {default as Import} from '../import/Import';
import {InstallFragmentModalBody} from '../modals/InstallFragmentModal';

async function fetchFragmentBlob(marketplaceRest: MarketplaceRest, url: URL) {
	const response = await marketplaceRest.fetchMarketplace<Response>(
		url.pathname,
		{
			earlyReturn: true,
		}
	);

	return response.blob();
}

function getProductAttachmentBlob(
	marketplaceRest: MarketplaceRest,
	product: Product
) {
	return fetchFragmentBlob(
		marketplaceRest,
		new URL(product.attachments[0].src)
	);
}

interface Props {
	backURL: string;
	importURL: string;
	portletNamespace: string;
}

export default function MarketplaceViews({
	backURL,
	importURL,
	portletNamespace,
}: Props) {
	const {marketplaceRest, product, setProduct, setView, view} =
		useMarketplaceContext();

	const [file, setFile] = useState<File | null>(null);

	async function onClickInstall(product: Product) {
		setView(MarketplaceView.PURCHASE);
		setProduct(product);

		try {
			const cart = await marketplaceRest.createCart(product as Product, {
				orderTypeExternalReferenceCode: 'FRAGMENT',
			});

			await marketplaceRest.checkoutCart(cart);

			const blob = await getProductAttachmentBlob(
				marketplaceRest,
				product
			);

			if (blob) {
				const file = new File(
					[blob],
					`${product.name.replace(' ', '-').toLowerCase()}.zip`,
					{type: 'application/zip'}
				);
				setFile(file);
			}

			Liferay.Util.openToast({
				message: Liferay.Language.get(
					'your-request-completed-successfully'
				),
				title: Liferay.Language.get('success'),
				type: 'success',
			});
		}
		catch (error) {
			console.error(error);

			Liferay.Util.openToast({
				message: Liferay.Language.get('an-unexpected-error-occurred'),
				title: Liferay.Language.get('danger'),
				type: 'danger',
			});
		}
	}

	if (file) {
		return (
			<Import
				backURL={backURL}
				importURL={importURL}
				marketplaceFile={file}
				portletNamespace={portletNamespace}
			/>
		);
	}

	return (
		<>
			{view === MarketplaceView.PRODUCTS && (
				<Marketplace.Products
					onClickProduct={(product) => {
						setProduct(product);

						setView(MarketplaceView.STOREFRONT);
					}}
				>
					{(product) => (
						<ClayButton
							className="w-100"
							onClick={() => {
								onClickInstall(product);
							}}
						>
							{Liferay.Language.get('install')}
						</ClayButton>
					)}
				</Marketplace.Products>
			)}

			{view === MarketplaceView.STOREFRONT && (
				<Marketplace.Storefront
					primaryButton={
						<ClayButton
							className="ml-auto mt-3 rounded"
							onClick={() => onClickInstall(product)}
						>
							{Liferay.Language.get('install')}
						</ClayButton>
					}
				/>
			)}

			{view === MarketplaceView.PURCHASE && (
				<div className="p-4">
					<InstallFragmentModalBody />
				</div>
			)}
		</>
	);
}

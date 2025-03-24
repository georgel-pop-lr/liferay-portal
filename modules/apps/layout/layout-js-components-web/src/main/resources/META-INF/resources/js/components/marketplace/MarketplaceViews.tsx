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
	PlacedOrder,
	Product,
	useMarketplaceContext,
} from '@liferay/marketplace-js-components-web';
import {openToast} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useCallback} from 'react';

import importFragmentsZipFile from '../import_fragments/importFragmentsZipFile';
import {InstallFragmentModalBody} from '../modals/InstallFragmentModal';

async function fetchFragmentBlob(
	marketplaceRest: MarketplaceRest,
	url: string
) {
	const response = await marketplaceRest.fetchMarketplace<Response>(url, {
		earlyReturn: true,
	});

	return response.blob();
}

async function getVirtualEntryBlob(
	placedOrder: PlacedOrder,
	marketplaceRest: MarketplaceRest
) {
	if (!placedOrder.placedOrderItems.length) {
		return;
	}

	const [virtualItem] = placedOrder.placedOrderItems?.[0]?.virtualItems ?? [];

	if (!virtualItem) {
		return;
	}

	return fetchFragmentBlob(marketplaceRest, virtualItem.url);
}

const sleep = (timer: number) =>
	new Promise((resolve) => setTimeout(() => resolve(true), timer));

function getProductAttachmentBlob(
	marketplaceRest: MarketplaceRest,
	product: Product
): Promise<Blob> {
	if (!product.attachments || !product.attachments.length) {
		throw new Error('Product has no attachments.');
	}

	return fetchFragmentBlob(
		marketplaceRest,
		new URL(product.attachments[0].src).pathname
	);
}

interface MarketplaceViewsProps {
	fragmentPortletNamespace: string;
	fragmentsImportURL: string;
	showBackButton?: boolean;
}

export default function MarketplaceViews({
	fragmentPortletNamespace,
	fragmentsImportURL,
	showBackButton,
}: MarketplaceViewsProps) {
	const {
		marketplaceRest,
		modal: {onOpenChange},
		product,
		setProduct,
		setView,
		view,
	} = useMarketplaceContext();

	const handleImportFile = useCallback(
		async (file: File) => {
			try {
				await importFragmentsZipFile({
					file,
					handleResponse: ({importResults}, file) => {
						if (!Object.keys(importResults).length) {
							openToast({
								message: sub(
									Liferay.Language.get(
										'no-new-items-were-imported'
									),
									file.name
								),
								type: 'info',
							});
						}
						else {
							window.location.reload();
						}
					},
					importURL: fragmentsImportURL,
					marketplace: true,
					overwriteStrategy: 'keep_both',
					portletNamespace: fragmentPortletNamespace,
				});
			}
			catch (error) {
				console.error('Import failed:', error);
			}
		},
		[fragmentsImportURL, fragmentPortletNamespace]
	);

	const handleInstallProduct = useCallback(
		async (product: Product) => {
			setView(MarketplaceView.PURCHASE);
			setProduct(product);

			try {
				const cart = await marketplaceRest.createCart(
					product as Product,
					{
						orderTypeExternalReferenceCode:
							'LOW_CODE_CONFIGURATION',
					}
				);

				await marketplaceRest.checkoutCart(cart);

				// Temporary workaround, wait until the virtualItem is activated from the object action

				await sleep(1500);

				const placedOrder = await marketplaceRest.getPlacedOrder(
					cart.id,
					new URLSearchParams({nestedFields: 'placedOrderItems'})
				);

				// This is an example of a virtual Entry
				// Currently there is an issue to retrieve the virtual item
				// from the cart due this bug: https://liferay.atlassian.net/browse/LPD-50173
				// getVirtualEntryBlob would be the ideal solution for this case.

				const blob = await getVirtualEntryBlob(
					placedOrder,
					marketplaceRest
				);

				// This is an example of a product attachment
				// We will (for now) save the fragment zip inside the product attachment
				// in order to not block the whole development of this feature

				// const blob = await getProductAttachmentBlob(
				// 	marketplaceRest,
				// 	product
				// );

				if (blob) {
					const file = new File(
						[blob],
						`${product.name.replace(' ', '-').toLowerCase()}.zip`,
						{type: 'application/zip'}
					);

					await handleImportFile(file);

					openToast({
						message: Liferay.Language.get(
							'your-request-completed-successfully'
						),
						title: Liferay.Language.get('success'),
						type: 'success',
					});
				}
			}
			catch (error: any) {
				console.error('Installation failed:', error);
				openToast({
					message: Liferay.Language.get(
						'an-unexpected-error-occurred'
					),
					title: Liferay.Language.get('danger'),
					type: 'danger',
				});
				onOpenChange(false);
			}
		},
		[marketplaceRest, setProduct, setView, handleImportFile, onOpenChange]
	);

	console.log({view});

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
							onClick={() => handleInstallProduct(product)}
						>
							{Liferay.Language.get('install')}
						</ClayButton>
					)}
				</Marketplace.Products>
			)}

			{view === MarketplaceView.STOREFRONT && (
				<Marketplace.Storefront
					onClickBack={
						showBackButton
							? () => setView(MarketplaceView.PRODUCTS)
							: undefined
					}
					primaryButton={
						<ClayButton
							className="ml-auto mt-3 rounded"
							onClick={() => handleInstallProduct(product)}
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

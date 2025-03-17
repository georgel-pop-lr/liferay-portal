/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {
	Marketplace,
	MarketplaceContextProvider,
	MarketplaceRest,
	MarketplaceView,
	useMarketplaceContext,
} from '@liferay/marketplace-js-components-web';
import {sub} from 'frontend-js-web';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';

import MarketplaceViews from '../marketplace/MarketplaceViews';

interface Props {
	backURL: string;
	importURL: string;
	portletNamespace: string;
	trigger?: ReactElement;
}

function MarketplaceModal({
	backURL,
	importURL,
	portletNamespace,
	trigger,
}: Props) {
	const [title, setTitle] = useState<string | undefined>();
	const [importSuccessfully, setImportSuccessfully] =
		useState<boolean>(false);

	return (
		<MarketplaceContextProvider
			baseResourceURL={MarketplaceRest.getBaseResourceURL()}
			onCloseModal={() => {
				if (importSuccessfully) {
					window.location.reload();
				}
			}}
			settings={{productFilter: 'fragments'}}
		>
			<Marketplace.Modal
				title={title}
				trigger={
					<MarketplaceModalTrigger
						setTitle={setTitle}
						trigger={trigger}
					/>
				}
			>
				<MarketplaceViews
					backURL={backURL}
					importURL={importURL}
					portletNamespace={portletNamespace}
				/>
			</Marketplace.Modal>
		</MarketplaceContextProvider>
	);
}

function MarketplaceModalTrigger({
	setTitle,
	trigger,
}: {
	setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
	trigger?: ReactElement;
}) {
	const {
		modal: {onOpenChange},
		product,
		setView,
		view,
	} = useMarketplaceContext();

	const handleClick = useCallback(() => {
		if (view === MarketplaceView.PURCHASE) {
			setView(MarketplaceView.PRODUCTS);
		}
		onOpenChange(true);
	}, [view, setView, onOpenChange]);

	useEffect(() => {
		if (view === MarketplaceView.PURCHASE) {
			setTitle(sub(Liferay.Language.get('installing-x'), product.name));
		}
		else {
			setTitle(undefined);
		}
	}, [view, product.name, setTitle]);

	return trigger ? (
		trigger
	) : (
		<ClayButtonWithIcon
			aria-label={Liferay.Language.get('open-marketplace-explorer')}
			borderless
			displayType="secondary"
			monospaced
			onClick={handleClick}
			size="sm"
			symbol="marketplace"
			title={Liferay.Language.get('open-marketplace-explorer')}
		/>
	);
}

export default MarketplaceModal;

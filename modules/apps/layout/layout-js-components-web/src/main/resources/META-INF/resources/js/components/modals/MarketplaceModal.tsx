/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {
	Marketplace,
	MarketplaceContext,
	MarketplaceContextProvider,
	MarketplaceRest,
	MarketplaceView,
	useMarketplaceContext,
} from '@liferay/marketplace-js-components-web';
import {sub} from 'frontend-js-web';
import React, {
	ComponentProps,
	ReactElement,
	cloneElement,
	useCallback,
	useEffect,
	useState,
} from 'react';

import MarketplaceViews from '../marketplace/MarketplaceViews';

export default function MarketplaceModal({
	trigger,
	...marketplaceViewProps
}: {
	trigger?: ReactElement;
} & ComponentProps<typeof MarketplaceViews>) {
	const [title, setTitle] = useState<string | undefined>();

	return (
		<MarketplaceContextProvider
			baseResourceURL={MarketplaceRest.getBaseResourceURL()}
			settings={{productFilter: 'fragments'}}
		>
			<MarketplaceContext.Consumer>
				{({view}) => (
					<Marketplace.Modal
						noConnectionMessage={Liferay.Language.get(
							'please-go-to-instance-settings-to-enable-the-connection'
						)}
						size={
							view === MarketplaceView.PURCHASE
								? ('md' as any)
								: 'full-screen'
						}
						title={title}
						trigger={
							<MarketplaceModalTrigger
								setTitle={setTitle}
								trigger={trigger}
							/>
						}
					>
						<MarketplaceViews {...marketplaceViewProps} />
					</Marketplace.Modal>
				)}
			</MarketplaceContext.Consumer>
		</MarketplaceContextProvider>
	);
}

interface MarketplaceModalTriggerProps {
	setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
	trigger?: ReactElement;
}

function MarketplaceModalTrigger({
	setTitle,
	trigger,
}: MarketplaceModalTriggerProps) {
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
		setTitle(
			view === MarketplaceView.PURCHASE && product
				? sub(Liferay.Language.get('installing-x'), product.name)
				: undefined
		);
	}, [view, product, setTitle]);

	if (trigger) {
		return cloneElement(trigger, {
			onClick: (event: React.MouseEvent) => {
				handleClick();
				if (trigger.props.onClick) {
					trigger.props.onClick(event);
				}
			},
		});
	}

	return (
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

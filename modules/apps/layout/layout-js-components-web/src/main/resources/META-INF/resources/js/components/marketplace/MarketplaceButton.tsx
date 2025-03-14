/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import React, {useCallback, useState} from 'react';

import MarketplaceModal from '../../../../../../../../../../../apps/layout/layout-js-components-web/src/main/resources/META-INF/resources/js/components/modals/MarketplaceModal';
import MarketplacePresentationModal from '../../../../../../../../../../../apps/layout/layout-js-components-web/src/main/resources/META-INF/resources/js/components/modals/MarketplacePresentationModal';
import openModalComponent from '../modals/openModalComponent';

import '../../../css/MarketplaceButton.scss';

import classNames from 'classnames';

interface Props {
	backURL: string;
	body: string;
	heading: string;
	importURL: string;
	isMarketplaceButtonVisited: boolean;
	portletNamespace: string;
}

function MarketplaceButton({
	backURL,
	body,
	heading,
	importURL,
	isMarketplaceButtonVisited,
	portletNamespace,
}: Props) {
	const [visited, setVisited] = useState(isMarketplaceButtonVisited);

	const handleClick = useCallback(() => {
		openModalComponent({
			ModalComponent: MarketplacePresentationModal,
			modalComponentProps: {body, heading},
		});

		setVisited(true);
		Liferay.Util.Session.set(
			`${portletNamespace}isMarketplaceButtonVisited`,
			true
		);
	}, [body, heading, portletNamespace]);

	if (visited) {
		return (
			<MarketplaceModal
				backURL={backURL}
				importURL={importURL}
				portletNamespace={portletNamespace}
			/>
		);
	}

	return (
		<ClayButtonWithIcon
			aria-label={Liferay.Language.get('open-marketplace-explorer')}
			borderless
			className={classNames('marketplace-button ml-2', {
				notification: !isMarketplaceButtonVisited,
			})}
			displayType="secondary"
			id={`${portletNamespace}isMarketplaceButtonVisited`}
			monospaced
			onClick={handleClick}
			size="sm"
			symbol="marketplace"
			title={Liferay.Language.get('open-marketplace-explorer')}
		/>
	);
}

export default MarketplaceButton;

/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayForm from '@clayui/form';
import {AssetVocabularyCategoriesSelector} from 'asset-taglib';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

function AssetFeedCategories({
	allSelectedItems,
	categorySelectorURL,
	groupIds,
	namespace,
	vocabularyIds,
}) {
	const [selectedItems, setSelectedItems] = useState(allSelectedItems || []);

	return (
		<ClayForm.Group>
			<label htmlFor={`${namespace}queryCategoryId`}>
				{Liferay.Language.get('category')}
			</label>

			<AssetVocabularyCategoriesSelector
				categoryIds={selectedItems.map((item) => item.value).join(',')}
				eventName={`${namespace}selectCategory`}
				groupIds={groupIds}
				inputName={`${namespace}queryCategoryId`}
				onSelectedItemsChange={setSelectedItems}
				portletURL={categorySelectorURL}
				selectedItems={selectedItems}
				singleSelect={true}
				sourceItemsVocabularyIds={vocabularyIds}
			/>
		</ClayForm.Group>
	);
}

AssetFeedCategories.propTypes = {
	allSelectedItems: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				value: PropTypes.oneOfType([
					PropTypes.number,
					PropTypes.string,
				]),
			})
		),
	]),
	categorySelectorURL: PropTypes.string,
	groupIds: PropTypes.arrayOf(PropTypes.string),
	namespace: PropTypes.string,
	vocabularyIds: PropTypes.arrayOf(PropTypes.string),
};

export default function (props) {
	return <AssetFeedCategories {...props} />;
}

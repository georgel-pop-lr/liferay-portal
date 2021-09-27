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

AUI.add('liferay-calendar-base-override', (A) => {
	var temp = document.createElement('DIV');
	temp.innerHTML = A.CalendarBase.HEADER_TEMPLATE;
	var lastNode = temp.childNodes[temp.childNodes.length - 1];
	var lastNodeHTML = lastNode.innerHTML;
	lastNodeHTML = lastNodeHTML
		.replace('aria-role="heading"', '')
		.replace('<div', '<h1')
		.replace('</div>', '</h1>');
	lastNode.innerHTML = lastNodeHTML;

	A.CalendarBase.HEADER_TEMPLATE = temp.innerHTML;
});

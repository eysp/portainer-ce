/**
 * Offset getter method from jQuery: https://github.com/jquery/jquery/blob/3.1.1/src/offset.js#L78
 */
export const getOffset = (element: HTMLElement): { top: number, left: number } => {
	if (!element) return;
	if (!element.getClientRects().length) return { top: 0, left: 0 };

	// https://github.com/jquery/jquery/blob/3.1.1/src/core.js#L220
	const isWindow = (obj: Window): boolean => obj != null && obj === obj.window;
	const getWindow = (elem: any): Window => isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView; // tslint:disable-line:no-any

	let rect: ClientRect = element.getBoundingClientRect();
	if (!rect.width && !rect.height) return rect;
	
	let doc: Document        = element.ownerDocument;
	let win: Window          = getWindow(doc);
	let docElem: HTMLElement = doc.documentElement;

	return {
		top: rect.top + win.pageYOffset - docElem.clientTop,
		left: rect.left + win.pageXOffset - docElem.clientLeft
	};
};
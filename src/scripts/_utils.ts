export const find = <E extends Element>(q: string) => document.querySelector<E>(q);
export const findAll = <E extends Element>(q: string) => Array.from(document.querySelectorAll<E>(q));

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const formatNumber = (value: number, decimals: number = 2) =>
	new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimals,
	}).format(value);

export const startViewTransition = (callback: () => void) => {
	//	If the browser doesnt support view transitions
	if (!document.startViewTransition) {
		callback();
		return;
	}
	document.startViewTransition(callback);
};

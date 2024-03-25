export const find = document.querySelector.bind(document);
export const findAll = (q: string) => Array.from(document.querySelectorAll(q));

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const formatNumber = (value: number) =>
	new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
	}).format(value);

export const startViewTransition = (callback: () => void) => {
	//	If the browser doesnt support view transitions
	if (!document.startViewTransition) {
		callback();
		return;
	}
	document.startViewTransition(callback);
};

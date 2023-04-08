import { expect } from "vitest";

/**
 * Asserts that all selectors should be found in the CSS source.
 *
 * @param selectors selectors that are expected to be found in css
 * @param css css source to check selectors against
 */
export function findInCss(selectors: string[], css: string): void {
	selectors.forEach((selector) => {
		expect(css.includes(selector)).toBe(true);
	});
}
/**
 * Asserts that all selectors should not be found in the CSS source.
 *
 * @param selectors selectors that are not expected to be found in css
 * @param css css source to check selectors against
 */
export function notFindInCss(selectors: string[], css: string): void {
	selectors.forEach((selector) => {
		expect(css.includes(selector)).toBe(false);
	});
}

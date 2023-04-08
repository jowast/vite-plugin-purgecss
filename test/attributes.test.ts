import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/attributes");

describe("purgecss attibutes", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				dynamicAttributes: ["aria-selected"],
			}),
		]);
		output = results["index.css"];
	});

	it("always keep attribute when attribute is 'value'", () => {
		expect(output.includes('input[value=""]')).toBe(true);
	});

	it("handles [attribute]", () => {
		// keep used css
		expect(output.includes("a[target]")).toBe(true);
		expect(output.includes("input[checked]")).toBe(true);
		// remove unused css
		expect(output.includes("a[invented]")).toBe(false);
	});

	it("handles [attribute=value]", () => {
		// keep used css
		expect(output.includes('a[target="_blank"]')).toBe(true);
		// remove unused css
		expect(output.includes('a[target="no_blank"]')).toBe(false);
	});

	it("handles [attribute~=value]", () => {
		// keep used css
		expect(output.includes('input[title~="flower"]')).toBe(true);
		// remove unused css
		expect(output.includes('input[title~="grass]')).toBe(false);
	});

	it("handles [attribute|=value]", () => {
		// keep used css
		expect(output.includes('html[lang|="en"]')).toBe(true);
		// remove unused css
		expect(output.includes('html[lang|="fr"]')).toBe(false);
	});

	it("handles [attribute^=value]", () => {
		// keep used css
		expect(output.includes('a[href^="http"]')).toBe(true);
		// remove unused css
		expect(output.includes('a[href^="ssl"]')).toBe(false);
	});

	it("handles [attribute$=value]", () => {
		// keep used css
		expect(output.includes('a[href$="pdf"]')).toBe(true);
		// remove unused css
		expect(output.includes('a[href$="jpg"]')).toBe(false);
		expect(output.includes('a[href$="http"]')).toBe(false);
	});

	it("handles [attribute*=value]", () => {
		// keep used css
		expect(output.includes('a[title*="thin"]')).toBe(true);
		// remove unused css
		expect(output.includes('a[title*="fat"]')).toBe(false);
	});

	it("handles spaces in attribute selector", () => {
		expect(output.includes('[class*=" class2"]')).toBe(true);
		expect(output.includes('[class*="class1 class2 "]')).toBe(true);
	});

	it("keeps dynamic attributes", () => {
		expect(output.includes("[aria-selected]")).toBe(true);
	});
});

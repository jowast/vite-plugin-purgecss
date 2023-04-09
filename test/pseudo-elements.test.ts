import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuildCss } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/pseudo-elements");

describe("purgecss pseudo elements", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuildCss(root, [pluginPurgeCss()]);
		output = results["index.css"];
	});

	it("finds root pseudo-elements", () => {
		expect(output.includes("::-webkit-file-upload-button")).toBe(true);
		expect(output.includes("::grammar-error")).toBe(true);
		expect(output.includes("::-webkit-datetime-edit-fields-wrapper")).toBe(
			true
		);
		expect(output.includes("::-moz-focus-inner")).toBe(true);
		expect(output.includes("::file-selector-button")).toBe(true);
	});

	it("finds pseudo-elements on used class", () => {
		expect(output.includes(".used::grammar-error")).toBe(true);
	});

	it("removes pseudo-elements on unused class", () => {
		expect(output.includes(".unused::grammar-error")).toBe(false);
	});
});

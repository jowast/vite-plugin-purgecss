import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuildCss } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/unused");

describe("purgecss remove unused css", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuildCss(root, [pluginPurgeCss()]);
		output = results["index.css"];
	});

	it("contains .used-class", () => {
		expect(output.includes(".used-class")).toBe(true);
	});

	it("removes .unused-class", () => {
		expect(output.includes(".unused-class")).toBe(false);
	});

	it("removes .another-one-not-found", () => {
		expect(output.includes(".another-one-not-found")).toBe(false);
	});
});

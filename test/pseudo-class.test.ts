import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/pseudo-class");

describe("purgecss pseudo classes and selectors", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuild(root, [pluginPurgeCss()]);
		output = results["index.css"];
	});

	it("finds foo-bar", () => {
		expect(output.includes("foo-bar")).toBe(true);
	});

	it("finds foo", () => {
		expect(output.includes(".foo")).toBe(true);
	});

	it("finds another-item:nth-child(2n)", () => {
		expect(output.includes("another-item:nth-child(2n)")).toBe(true);
	});

	it("finds another-item:nth-child(2n + 1)", () => {
		expect(output.includes("another-item:nth-child(2n + 1)")).toBe(true);
	});

	it("finds another-item:nth-of-type(n + 3)", () => {
		expect(output.includes("another-item:nth-of-type(n + 3)")).toBe(true);
	});

	it("finds another-item:nth-of-type(-1n + 6)", () => {
		expect(output.includes("another-item:nth-of-type(-1n + 6)")).toBe(true);
	});

	it("finds another-item:nth-of-type(-n + 6)", () => {
		expect(output.includes("another-item:nth-of-type(-n + 6)")).toBe(true);
	});

	it("removes unused:only-child()", () => {
		expect(output.includes("unused:only-child()")).toBe(false);
	});

	it("finds used:only-child()", () => {
		expect(output.includes("used:only-child()")).toBe(true);
	});

	it("finds odd-item:nth-child(odd)", () => {
		expect(output.includes("odd-item:nth-child(odd)")).toBe(true);
	});

	it("finds some-item:nth-child(2n)", () => {
		expect(output.includes("some-item:nth-child(2n)")).toBe(true);
	});

	it("finds some-item:nth-child(2n + 1)", () => {
		expect(output.includes("some-item:nth-child(2n + 1)")).toBe(true);
	});

	it('removes canvas (contains "n")', () => {
		expect(output.includes("canvas")).toBe(false);
	});

	it("finds div:before", () => {
		expect(output.includes("div:before")).toBe(true);
	});

	it("removes row:after", () => {
		expect(output.includes("row:after")).toBe(false);
	});
});

import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { findInCss } from "./util/css";
import { viteBuildCss } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/comments");

describe("purgecss ignore comments", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuildCss(root, [pluginPurgeCss()]);
		output = results["index.css"];
	});

	it("ignores h1, h3, h5, h6", () => {
		findInCss(["h1", "h2", "h3", "h5", "h6", "dialog"], output);
	});

	it("removes h4", () => {
		expect(output.includes("h4")).toBe(false);
	});

	it("removes the comments", () => {
		expect(output.includes("/* purgecss ignore */")).toBe(false);
		expect(output.includes("/* purgecss ignore current */")).toBe(false);
		expect(output.includes("/* purgecss start ignore */")).toBe(false);
		expect(output.includes("/* purgecss end ignore */")).toBe(false);
	});
});

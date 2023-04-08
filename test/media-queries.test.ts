import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/media-queries");

describe("purgecss media queries", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuild(root, [pluginPurgeCss()]);
		output = results["index.css"];
	});

	it("finds .media-class", () => {
		expect(output.includes(".media-class")).toBe(true);
	});

	it("finds .alone", () => {
		expect(output.includes(".alone")).toBe(true);
	});

	it("finds #id-in-media", () => {
		expect(output.includes("#id-in-media")).toBe(true);
	});

	it("finds body", () => {
		expect(output.includes("body")).toBe(true);
	});

	it("removes .unused-class", () => {
		expect(output.includes(".unused-class")).toBe(false);
	});

	it("removes the empty media query", () => {
		expect(output.includes("66666px")).toBe(false);
	});
});

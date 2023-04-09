import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { notFindInCss } from "./util/css";
import { viteBuildCss } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/chaining");

describe("purgecss chaining rules", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuildCss(root, [pluginPurgeCss()]);
		output = results["index.css"];
	});

	it("keeps parent1 selector", () => {
		expect(output.includes("parent1")).toBe(true);
	});

	it("removes parent3, d33ef1, .parent2", () => {
		notFindInCss(["parent3", "d33ef1", "parent2"], output);
	});
});

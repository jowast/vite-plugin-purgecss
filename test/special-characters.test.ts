import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuildCss } from "./util/vite-build";
import pluginPurgeCss from "../src";

import type { ExtractorResult } from "purgecss";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/special-characters");

describe("purgecss special characters, with custom extractor", () => {
	let output: string;

	const CustomExtractor = (content: string): ExtractorResult =>
		content.match(/[A-z0-9-:/]+/g) || [];

	beforeAll(async () => {
		const results = await viteBuildCss(root, [
			pluginPurgeCss({
				extractors: [
					{
						extractor: CustomExtractor,
						extensions: ["html", "js"],
					},
				],
			}),
		]);
		output = results["index.css"];
	});

	it("finds tailwind class", () => {
		expect(output.includes("md\\:w-1\\/3")).toBe(true);
	});

	it("discards unused class beginning with number", () => {
		expect(output.includes("\\32 -panel")).toBe(false);
	});
});

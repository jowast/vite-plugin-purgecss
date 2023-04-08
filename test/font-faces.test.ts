import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/font-faces");

describe("purgecss font-face", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuild(root, [pluginPurgeCss({ fontFace: true })]);
		output = results["index.css"];
	});

	it("keep @font-face 'Cerebri Bold'", () => {
		expect(output.includes(`src: url("../fonts/CerebriSans-Bold.eot?")`)).toBe(
			true
		);
	});

	it("keep @font-face 'Cerebri Sans'", () => {
		expect(
			output.includes(`src: url("../fonts/CerebriSans-Regular.eot?")`)
		).toBe(true);
	});

	it("remove @font-face 'OtherFont'", () => {
		expect(output.includes(`src: url("xxx")`)).toBe(false);
	});
});

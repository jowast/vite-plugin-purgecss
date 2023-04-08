import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/css-variables");

describe("purgecss css variables", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({ variables: true }),
		]);
		output = results["index.css"];
	});

	it("keeps '--primary-color'", () => {
		expect(output.includes("--primary-color:")).toBe(true);
	});

	it("keeps '--accent-color', '--used-color'", () => {
		expect(output.includes("--accent-color:")).toBe(true);
		expect(output.includes("--used-color:")).toBe(true);
	});

	it("removes '--tertiary-color', '--unused-color' and '--button-color'", () => {
		expect(output.includes("--tertiary-color")).toBe(false);
		expect(output.includes("--unused-color")).toBe(false);
		expect(output.includes("--button-color")).toBe(false);
	});

	it("keeps '--color-first:', '--wrong-order'", () => {
		expect(output.includes("--color-first:")).toBe(true);
		expect(output.includes("--wrong-order:")).toBe(true);
	});
});

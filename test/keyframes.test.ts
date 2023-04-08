import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, it } from "vitest";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = path.resolve(__dirname, "./fixtures/keyframes");

describe("purgecss keyframe animations", () => {
	let output: string;

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({ keyframes: true }),
		]);
		output = results["index.css"];
	});

	it("finds bounce", () => {
		expect(output.includes("bounce")).toBe(true);
	});

	it("removes flash", () => {
		expect(output.includes("@keyframes flash")).toBe(false);
	});

	it("keeps keyframes from animations with multiple keyframes", () => {
		expect(output.includes("@keyframes scale")).toBe(true);
		expect(output.includes("@keyframes spin")).toBe(true);
	});

	it("removes `@keyframes flashAni`", () => {
		expect(output.includes("@keyframes flashAni")).toBe(false);
	});

	it("keeps `@keyframes rotateAni`", () => {
		expect(output.includes("@keyframes rotateAni")).toBe(true);
	});
});

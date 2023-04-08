import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, it } from "vitest";
import { findInCss, notFindInCss } from "./util/css";
import { viteBuild } from "./util/vite-build";
import pluginPurgeCss from "../src";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("purgecss safelist string", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: ["random", "h1", "yep", "button"],
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted selectors", () => {
		findInCss([".random", "h1", "#yep", "button"], output);
	});
});

describe("purgecss safelist regular expression", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: [/nav-/, /data-v-.*/],
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted selectors", () => {
		findInCss([".nav-blue", ".nav-red", "[data-v-test]"], output);
	});
});

describe("purgecss safelist standard option", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: {
					standard: ["random", "h1", "yep", "button", /nav-/, /data-v-.*/],
				},
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted selectors", () => {
		findInCss(
			[
				".random",
				"h1",
				"#yep",
				"button",
				".nav-blue",
				".nav-red",
				"[data-v-test]",
			],
			output
		);
	});
});

describe("purgecss safelist deep option", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist/deep");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: {
					deep: [/^card$/],
				},
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted selectors", () => {
		findInCss(
			[".card", ".card .content", ".btn", ".card .btn .yellow"],
			output
		);
	});

	it("excludes selectors not safelisted", () => {
		notFindInCss([".title", ".btn .red", ".btn__green"], output);
	});
});

describe("purgecss safelist greedy option", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist/greedy");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: {
					greedy: [/data-v-.*/],
				},
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted selectors", () => {
		findInCss(
			[
				".card",
				".card[data-v-test]",
				".card[data-v-test].card--large",
				".card[data-v-test] .card-content",
			],
			output
		);
	});

	it("excludes selectors not safelisted", () => {
		notFindInCss([".card.card--large", ".card .card-content"], output);
	});
});

describe("purgecss safelist keyframes option", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist/keyframes");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: {
					keyframes: [/^scale/, "spin"],
				},
				keyframes: true,
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted keyframes", () => {
		findInCss(
			["@keyframes scale", "@keyframes scale-down", "@keyframes spin"],
			output
		);
	});

	it("excludes non-safelisted keyframes", () => {
		notFindInCss(["flash"], output);
	});
});

describe("purgecss safelist variables option", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist/variables");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				safelist: {
					variables: [/^--b/, "--unused-color"],
				},
				variables: true,
			}),
		]);
		output = results["index.css"];
	});

	it("finds safelisted css variables", () => {
		findInCss(["--unused-color", "--button-color"], output);
	});

	it("excludes non-safelisted css variables", () => {
		notFindInCss(["--tertiary-color:"], output);
	});
});

describe("purgecss safelist blocklist option", () => {
	let output: string;

	const root = path.resolve(__dirname, "./fixtures/safelist/blocklist");

	beforeAll(async () => {
		const results = await viteBuild(root, [
			pluginPurgeCss({
				blocklist: ["h1", "yep", "button", /nav-/],
			}),
		]);
		output = results["index.css"];
	});

	it("excludes blocklisted selectors", () => {
		notFindInCss(["h1", "yep", "button", "nav-blue", "nav-red"], output);
	});

	it("includes non-blocklisted selectors", () => {
		findInCss(["data-v-test", ".random"], output);
	});
});

import { build } from "vite";
import { cssRegExp, sourceString } from "../../src";

import type { OutputAsset, OutputChunk } from "rollup";
import type { PluginOption } from "vite";

/**
 * Bundle CSS assets for a project with Vite. Output files will not be written
 * to disk. All CSS file names will be returned without the addition of a hash.
 *
 * @param root root directory of project to build
 * @param plugins list of vite plugins for build
 * @returns map of css file name to bundled output
 */
export async function viteBuildCss(root: string, plugins: PluginOption[]) {
	let results = await build({
		root,
		plugins,
		publicDir: false,
		logLevel: "silent",
		build: {
			write: false,
			minify: false,
			modulePreload: {
				polyfill: false,
			},
			rollupOptions: {
				output: {
					entryFileNames: "[name].js",
					chunkFileNames: "[name].js",
					assetFileNames: "[name].[ext]",
				},
			},
		},
	});

	if (!("output" in results)) {
		throw new Error("unexpected RollupWatcher output from vite build");
	}

	if (!Array.isArray(results)) {
		results = [results];
	}

	const cssOutput: Record<string, string> = {};
	for (const result of results) {
		for (const output of result.output) {
			// Ignore all output chunks and non-CSS assets.
			if (!isCssAsset(output)) continue;
			cssOutput[output.fileName] = sourceString(output.source);
		}
	}

	return cssOutput;
}

/**
 * Type predicate indicating whether or not the argument is a CSS asset.
 *
 * @param output rollup ouput chunk or asset
 * @returns true if `output` is a css asset, otherwise false
 */
function isCssAsset(output: OutputChunk | OutputAsset): output is OutputAsset {
	return output.type === "asset" && cssRegExp.test(output.fileName);
}

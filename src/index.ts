import { extname } from "path";
import { PurgeCSS } from "purgecss";

import type { OutputAsset } from "rollup";
import type { Plugin } from "vite";
import type { Options, PurgeCssContent, PurgeCssStyles } from "./types";

// Regular expression for matching files with extensions `.css` and
// `.module.css`, including an optional query string.
export const cssRegExp = /^.*(\.module)?\.css(\?.*)?$/i;

/**
 * Vite plugin for removing unused CSS from generated bundles with PurgeCSS.
 *
 * **Note**: This plugin will not be called during dev due to its use of the
 * `generateBundle` output generation hook.
 *
 * @param opts plugin options
 * @returns purgecss vite plugin
 */
function purgeCssPlugin(opts?: Options): Plugin {
	return {
		name: "vite-plugin-purgecss",
		enforce: "post",
		async generateBundle(_, bundle) {
			let content: PurgeCssContent = [];
			let css: PurgeCssStyles = [];

			if (opts != null) {
				// Extract PurgeCSS content and css from options.
				const { content: optsContent, css: optsCss, ...rest } = opts;
				content = optsContent ?? content;
				css = optsCss ?? css;
				opts = rest;
			}

			// Cache of CSS assets that may be transformed.
			const outputs: Record<string, OutputAsset> = {};

			for (const id in bundle) {
				const file = bundle[id];
				const isChunk = file.type === "chunk";
				if (isChunk || !cssRegExp.test(file.fileName)) {
					// Add chunks and non-CSS assets to content array to be analyzed.
					content.push({
						extension: extname(file.fileName).slice(1),
						raw: isChunk ? file.code : sourceString(file.source),
					});
					continue;
				}

				// Add CSS assets to css array to be transformed.
				css.push({ name: id, raw: sourceString(file.source) });

				// Add output file to CSS asset cache.
				outputs[id] = file;
			}

			const results = await new PurgeCSS().purge({
				...opts,
				content,
				css,
			});

			for (const result of results) {
				// Replace CSS assets with PurgeCSS result.
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				outputs[result.file!].source = result.css;
			}
		},
	};
}

/**
 * Convert bundle contents to string, if needed.
 *
 * @param source string or binary data buffer
 * @returns `source` as string
 */
export function sourceString(source: string | Uint8Array) {
	if (typeof source === "string") {
		return source;
	}
	return new TextDecoder().decode(source);
}

export default purgeCssPlugin;
export type { Options, PurgeCssContent, PurgeCssStyles };

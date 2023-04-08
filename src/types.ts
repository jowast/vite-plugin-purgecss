import type { RawContent, RawCSS, UserDefinedOptions } from "purgecss";

/**
 * Plugin options for `vite-plugin-purgecss` vite plugin.
 *
 * @see {@link UserDefinedOptions} for further information.
 */
export declare type Options = Partial<UserDefinedOptions>;

/**
 * Content that should be analyzed by PurgeCSS.
 *
 * @see {@link UserDefinedOptions.content}
 */
export declare type PurgeCssContent = (string | RawContent<string>)[];

/**
 * CSS that should be processed by PurgeCSS.
 *
 * @see {@link UserDefinedOptions.css}
 */
export declare type PurgeCssStyles = (string | RawCSS)[];

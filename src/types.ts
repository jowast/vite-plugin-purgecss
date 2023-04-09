import type { RawContent, RawCSS, UserDefinedOptions } from "purgecss";

/**
 * Plugin options for `vite-plugin-purgecss` vite plugin.
 */
export declare type Options = Partial<UserDefinedOptions>;

/**
 * Content that should be analyzed by PurgeCSS.
 */
export declare type PurgeCssContent = (string | RawContent<string>)[];

/**
 * CSS that should be processed by PurgeCSS.
 */
export declare type PurgeCssStyles = (string | RawCSS)[];

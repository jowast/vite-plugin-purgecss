/* eslint-env node */

/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "import", "filenames"],
	root: true,
	ignorePatterns: ["dist", "node_modules", "**/*.d.ts"],
};

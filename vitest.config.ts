import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["./**/*.{test,spec}.{js,ts,cjs,mjs}"],
		coverage: {
			include: ["src/**/*.{js,ts,cjs,mjs}"],
			reporter: ["lcov", "text", "html"],
		},
	},
});

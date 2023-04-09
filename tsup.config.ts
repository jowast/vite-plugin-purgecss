import { defineConfig } from "tsup";

const entry = ["./src/index.ts"];

export default defineConfig({
	entry: ["./src/index.ts"],
	splitting: false,
	sourcemap: false,
	dts: { entry },
	clean: true,
	format: ["cjs", "esm"],
});
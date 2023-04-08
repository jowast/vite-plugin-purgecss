import { describe, expect, it } from "vitest";
import { sourceString } from "../src";

describe("output source", () => {
	it("returns unchanged string", () => {
		const text = "test string";
		expect(sourceString(text)).toBe(text);
	});

	it("converts binary data to string", () => {
		const text = "test binary data";
		const content = new Uint8Array(Buffer.from(text, "utf-8"));
		expect(sourceString(content)).toBe(text);
	});
});

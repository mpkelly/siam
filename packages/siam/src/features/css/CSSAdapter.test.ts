import { CssAdapter } from "./CssAdapter";
import { ExampleSystem } from "../system/StandardSystem";

describe("blah", () => {
	it("works", () => {
		const assets =  CssAdapter.generateAssets(ExampleSystem);
		console.log(assets[0])
		expect(2).toEqual(2);
	});
});

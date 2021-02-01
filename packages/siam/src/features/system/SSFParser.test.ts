import { parseSSFContent } from "./SSFParser";

const System = `
aliases
	tokens
		colors backgroundColor,color
		sizes width,height 
tokens
	colors
		primary blue
		primaryDark darkblue
		danger red
		dangerDark darkred
		lightText white
	borderRadius 
		sm 3
		md 6 
	sizes 
		controlRegularHeight 40
		controlLargeHeight 50
elements
	button
		borderRadius sm 
		color lightText        
		roles 
			primary 
				backgroundColor primary
				:hover
					backgroundColor primaryDark
			danger
				backgroundColor danger
				:hover 
					backgroundColor dangerDark
		size 
			regular controlRegularHeight
			large controlLargeHeight	
`.trim();

describe("blah", () => {
	it("works", () => {
		console.log(JSON.stringify(parseSSFContent(System), null, 2));
		expect(2).toEqual(2);
	});
});

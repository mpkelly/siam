import { parseSSFContent } from "./SSFParser";

const System = `
breakpoints
	xs 576
	sm 576
	md 768
	lg 992
	xl 1200
	xxl 1400
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
		primaryText black
		lightText white		
		primaryBackground white
		secondaryBackground #E4E4E4
	borderRadius 
		sm 3
		md 6 
	sizes 
		controlRegularHeight 40
		controlLargeHeight 50
	borderWidth
		regular 2
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
	input
		borderRadius sm
		color primaryText
		borderStyle line
		borderWidth regular
		borderColor transparent
		roles
			primary 
				backgroundColor secondaryBackground
				:hover
					borderColor primary
				:focus
					borderColor primary					
		size 
			regular
				height controlRegularHeight
			large
				height controlRegularHeight	
`.trim();

describe("blah", () => {
	it("works", () => {
		console.log(JSON.stringify(parseSSFContent(System), null, 2));
		expect(2).toEqual(2);
	});
});

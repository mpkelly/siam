export interface System {
	breakpoints?: Breakpoints;
	aliases?: Aliases;
	tokens?: Tokens;
	elements?: Elements;
}

interface Breakpoints {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
	xxl: number;
}

interface Aliases {
	tokens?: Alias;
	property?: Alias;
}

interface Alias {
	[key:string]: string[];
}

interface Tokens {
	[key:string]:PropertyTokens;
}

interface PropertyTokens {
	[key: string]: PropertyValue | BreakpointValue;
}

type PropertyValue = number | string | boolean;

type BreakpointValue = {
	xs?: PropertyValue;
	sm?: PropertyValue;
	md?: PropertyValue;
	lg?: PropertyValue;
	xl?: PropertyValue;
	xxl?: PropertyValue;
}

interface Elements {
	[key:string]: Element;
}

interface Element {
	[key:string]: PropertyValue | BreakpointValue | StateProperties | ModifierProperties
}

interface StateProperties {
	[key:string]: PropertyValue | BreakpointValue
}

interface ModifierProperties {
	[key:string]: {
		[key:string]: PropertyValue | BreakpointValue | StateProperties
	}
}

export const ExampleSystem:System =     {
	"breakpoints": {
		"xs": 576,
		"sm": 576,
		"md": 768,
		"lg": 992,
		"xl": 1200,
		"xxl": 1400
	},
	"aliases": {
		"tokens": {
			"colors": [
				"backgroundColor",
				"color"
			],
			"sizes": [
				"width",
				"height"
			]
		},
		property: {
			size: ["width", "height"]
		}
	},
	"tokens": {
		"colors": {
			"primary": "blue",
			"primaryDark": "darkblue",
			"danger": "red",
			"dangerDark": "darkred",
			"primaryText": "black",
			"lightText": "white",
			"primaryBackground": "white",
			"secondaryBackground": "#E4E4E4"
		},
		"borderRadius": {
			"sm": 3,
			"md": 6
		},
		"sizes": {
			"controlRegularHeight": 40,
			"controlLargeHeight": 50
		},
		"borderWidth": {
			"regular": 2
		}
	},
	"elements": {
		"button": {
			"borderRadius": "sm",
			"color": "lightText",
			"roles": {
				"primary": {
					"backgroundColor": "primary",
					":hover": {
						"backgroundColor": "primaryDark"
					}
				},
				"danger": {
					"backgroundColor": "danger",
					":hover": {
						"backgroundColor": "dangerDark",
					}
				}
			},
			"size": {
				"regular": {
					height: "controlRegularHeight",
				},
				"large": {
					height: "controlLargeHeight",
				}
			}
		},
		"input": {
			"borderRadius": "sm",
			"color": "primaryText",
			"borderStyle": "line",
			"borderWidth": "regular",
			"borderColor": "transparent",
			"roles": {
				"primary": {
					"backgroundColor": "secondaryBackground",
					":hover": {
						"borderColor": "primary"
					},
					":focus": {
						"borderColor": "primary"
					}
				}
			},
			"size": {
				"regular": {
					height: "controlRegularHeight",
				},
				"large": {
					height: "controlLargeHeight",
				}
			}
		}
	}
}

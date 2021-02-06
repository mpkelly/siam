import { DefaultBreakpoints } from "../responsive/Breakpoints";

export type System = {
	breakpoints?: Breakpoints;
	aliases?: Aliases;
	tokens?: Tokens;
	elements?: Elements;
} & {[key:string]: any}

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
	[key: string]: PropertyValue | BreakpointValues<PropertyValue>;
}

type PropertyValue = number | string | boolean;

export type BreakpointValues<T> = {
	xs?: T;
	sm?: T;
	md?: T;
	lg?: T;
	xl?: T;
	xxl?: T;
}

interface Elements {
	[key:string]: Element;
}

interface Element {
	[key:string]: PropertyValue | BreakpointValues<PropertyValue> | StateProperties | ModifierProperties
}

interface StateProperties {
	[key:string]: PropertyValue | BreakpointValues<PropertyValue>
}

interface ModifierProperties {
	[key:string]: {
		[key:string]: PropertyValue | BreakpointValues<PropertyValue> | StateProperties
	}
}

export const ExampleSystem:System =     {
	breakpoints: DefaultBreakpoints,
	"aliases": {
		"tokens": {
			"color": [
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
		"color": {
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
		"size": {
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

import { DefaultBreakpoints } from '../responsive/Breakpoints';

export type System = {
  breakpoints?: Breakpoints;
  aliases?: Aliases;
  tokens?: Tokens;
  elements?: Elements;
} & { [key: string]: any };

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
}

interface Alias {
  [key: string]: string[];
}

interface Tokens {
  [key: string]: PropertyTokens;
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
};

interface Elements {
  [key: string]: Element;
}

interface Element {
  [key: string]:
    | PropertyValue
    | BreakpointValues<PropertyValue>
    | StateProperties
    | ModifierProperties;
}

interface StateProperties {
  [key: string]: PropertyValue | BreakpointValues<PropertyValue>;
}

interface ModifierProperties {
  [key: string]: {
    [key: string]:
      | PropertyValue
      | BreakpointValues<PropertyValue>
      | StateProperties;
  };
}

export const ExampleSystem: System = {
  breakpoints: DefaultBreakpoints,
  aliases: {
    tokens: {
      color: ['backgroundColor', 'color', 'borderColor'],
      size: ['width', 'height'],
    },
  },
  tokens: {
    color: {
      primary: 'blue',
      primaryDark: 'darkblue',
      danger: 'red',
      dangerDark: 'darkred',
      primaryText: 'black',
      lightText: 'white',
      primaryBackground: 'white',
      secondaryBackground: '#E4E4E4',
    },
    borderRadius: {
      sm: {
        xs: 3,
        md: 6,
      },
      md: 6,
    },
    size: {
      controlRegularHeight: '40px',
      controlLargeHeight: '50px',
    },
    borderWidth: {
      regular: '2px',
    },
  },
  elements: {
    button: {
      borderRadius: 'sm',
      color: 'lightText',
      role: {
        primary: {
          backgroundColor: 'primary',
          padding: '8px',
          ':hover': {
            backgroundColor: 'primaryDark',
          },
        },
        danger: {
          backgroundColor: 'danger',
          padding: '8px',
          ':hover': {
            backgroundColor: 'dangerDark',
          },
        },
      },
      size: {
        regular: {
          height: {
            sm: 'controlRegularHeight',
            md: 'controlLargeHeight',
          },
        },
        large: {
          height: 'controlLargeHeight',
        },
      },
    },
    input: {
      borderRadius: 'sm',
      color: 'primaryText',
      borderStyle: 'solid',
      borderWidth: 'regular',
      borderColor: 'transparent',
      role: {
        primary: {
          backgroundColor: 'secondaryBackground',
          ':hover': {
            borderColor: 'primary',
          },
          ':focus': {
            borderColor: 'primary',
          },
        },
      },
      size: {
        regular: {
          height: 'controlRegularHeight',
        },
        large: {
          height: 'controlLargeHeight',
        },
      },
    },
  },
};

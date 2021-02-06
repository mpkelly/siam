import { PlatformAdapter } from '../adapter/PlatformAdapter';
import { ProjectDescriptor } from '../adapter/Project';
import { BreakpointValues, System } from '../system/StandardSystem';
import { isObject } from '../util/Object';
import { camelToHyphen } from '../util/ConvertCase';
import { DefaultBreakpoints } from '../responsive/Breakpoints';

export const Projects: ProjectDescriptor[] = [
  {
    name: 'CSS Variables',
    description:
      'Generate a single CSS file contain only the system tokens as CSS variables.',
  },
];

export const CssAdapter: PlatformAdapter = {
  availableProjects() {
    return Projects;
  },

  generateAssets(system: System) {
    return [
      {
        name: 'variables.css',
        description: 'System tokens as CSS Variables',
        contents: generateCssVariables(system),
      },
    ];
  },

  generateProject(system: System, name: string) {
    //TODO create project assets
    console.log(system);
    return { assets: [], name, description: 'description' };
  },
};

const createVariable = (property: string, tokenName: string, value: any) => {
  return `--${camelToHyphen(property)}-${camelToHyphen(tokenName)}:${value}`;
};

export const generateCssVariables = (system: System) => {
  if (system.tokens) {
    const breakValues: BreakpointValues<string[]> = {
      xs: [],
      sm: [],
      md: [],
      lg: [],
      xl: [],
      xxl: [],
    };
    const { tokens } = system;
    Object.keys(tokens).forEach((property) => {
      const value = tokens[property];
      Object.keys(value).forEach((token) => {
        const tokenValue = value[token];
        if (isObject(tokenValue)) {
          //it's an instance of BreakpointValues
          Object.keys(tokenValue).forEach((breakpoint) => {
            const variable = createVariable(
              property,
              token,
              (tokenValue as any)[breakpoint]
            );
            (breakValues as any)[breakpoint].push(variable);
          });
        } else {
          //it's just a single value for all breakpoints
          const variable = createVariable(property, token, tokenValue);
          breakValues.xs?.push(variable);
        }
      });
    });

    const output: string[] = [];
    const breakpoints = system.breakpoints || DefaultBreakpoints;

    Object.keys(breakValues).forEach((breakpoint) => {
      const breakWidth = (breakpoints as any)[breakpoint];
      const values = (breakValues as any)[breakpoint];
      if (values.length) {
        const body = values.join(';\n');
        if (breakWidth === 0) {
          output.push(body);
        } else {
          output.push(`@media (max-width: ${breakWidth}px) { ${body}}`);
        }
      }
    });
    const body = output.join('\n');

    return `:root{ ${body} }`;
  }
  return '';
};

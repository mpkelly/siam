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
  {
    name: 'Single file project',
    description: 'Output a single HTML file which includes inline CSS',
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
      {
        name: 'elements.css',
        description: 'System elements as CSS',
        contents: generateCssVariables(system),
      },
      {
        name: 'index.html',
        description: 'Single file project',
        contents: generateSingleFileProject(system),
      },
    ];
  },

  generateProject(system: System, name: string) {
    const project = this.availableProjects().find(
      (project) => project.name === name
    );

    const allAssets = this.generateAssets(system);

    if (project?.name === 'CSS Variables') {
      const assets = [{ ...allAssets[0], path: '/' }];
      return { assets, name, description: project.description };
    } else if (project?.name === 'Single file project') {
      const allAssets = this.generateAssets(system);
      const assets = [{ ...allAssets[2], path: '/' }];
      return { assets, name, description: project.description };
    }
    throw new Error(`No project named ${name}`);
  },
};

const createVariable = (property: string, tokenName: string, value: any) => {
  return `--${camelToHyphen(property)}-${camelToHyphen(tokenName)}:${value};`;
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
        const body = values.join('\n');
        if (breakWidth === 0) {
          output.push(body);
        } else {
          output.push(`@media (max-width: ${breakWidth}px) { ${body}}`);
        }
      }
    });
    const body = output.join('\n');

    return `:root{\n ${body} \n}`;
  }
  return '';
};

const generateSingleFileProject = (system: System) => {
  const variables = generateCssVariables(system);
  const css = `
			<style>${variables}</style>
		`;
  return generateHtmlIndexFile('', css);
};

const generateHtmlIndexFile = (body = '', head = '') => {
  return `
		<!doctype html>

		<html lang="en">
		<head>
			<meta charset="utf-8">
		
			<title>Siam HTML & CSS project</title>
		
			${head}
		
		</head>
		
		<body>
			${body}
		</body>
		</html>
		`;
};

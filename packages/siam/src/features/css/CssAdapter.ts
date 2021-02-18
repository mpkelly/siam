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
      'Generate a single CSS file containing only the system tokens as CSS variables.',
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
  return `${createVariableName(property, tokenName)}:${value}`;
};

const createVariableName = (property: string, tokenName: string) => {
  return `--${camelToHyphen(property)}-${camelToHyphen(tokenName)}`;
};

const createProperty = (property: string, tokenName: string) => {
  return `${camelToHyphen(property)}: var(${createVariableName(property, tokenName as string)})`
}

const getRootSelector = (system: System) => {
  if (!system.tokens) {
    return null
  }
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
  const breakpoints = system.breakpoints ?? DefaultBreakpoints;

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
  const root = output.join('\n');
  return `:root{ ${root} }`
}

const getSelectorCSS = (value: any, key: string, level: number) => {
  const allCss: string[] = []
  const propsCss: string[] = []
  const objectCss: string[] = []
  Object.keys(value).map((k) => {
    const v = value[k]
    if (level === 0 && isObject(v)) {
      /* handle variants */
      objectCss.push(getSelectorCSS(v, key, ++level))
    } else if (k[0] === ":") {
      /* handle states */
      objectCss.push(getSelectorCSS(v, `${key}${k}`, ++level))
    } else if (isObject(v)) {
      /* handle modifiers */
      objectCss.push(getSelectorCSS(v, `${key}.${k}`, ++level))
    } else {
      /* handle properties */
      propsCss.push(createProperty(k, v as string))
    }
  })
  const body = propsCss.join(";\n")
  const elemStr = body ? `${key} {\n${body};\n}` : ""
  allCss.push(elemStr)
  allCss.push(...objectCss)
  return allCss.join("\n")
}

const getElementsCSS = (system: System) => {
  const elementCss: string[] = []
  const { elements }: any = system
  Object.keys(elements).map((e) => {
    const value = elements[e]
    elementCss.push(getSelectorCSS(value, e, 0))
  })
  const allElementsCss = elementCss.join("\n")
  return allElementsCss
}

export const generateCssVariables = (system: System) => {
  const root = getRootSelector(system)
  const elements = getElementsCSS(system)
  return `${root}\n${elements}`
};


import { PlatformAdapter } from '../adapter/PlatformAdapter';
import { OutputSystem } from '../system/OutputSystem';

export const createCssPlatform = (system: OutputSystem): PlatformAdapter => {
  const assets = [
    {
      name: 'variables.css',
      description: 'System tokens as CSS variables',
      contents: generateCssVariables(system),
    },
    {
      name: 'elements.css',
      description: 'System elements as CSS',
      contents: generateElements(system),
    },
  ];
  return { assets, projects: [] };
};

const createVariable = (property: string, tokenName: string, value: any) => {
  return `${createVariableName(property, tokenName)}:${value}`;
};

const createVariableName = (property: string, tokenName: string) => {
  return `--${property}-${tokenName}`;
};

const createMediaQuery = (breakpoint: number, body: string) => {
  return `@media (max-width: ${breakpoint}px) { ${body}}`;
};

export const generateCssVariables = (system: OutputSystem) => {
  const batches: string[] = [];
  system.batchedTokens.forEach((batch) => {
    const variables = batch.values
      .map((variable) =>
        createVariable(
          variable.hyphenProperty,
          variable.hyphenName,
          variable.value
        )
      )
      .join(';\n');
    if (batch.breakpoint === 0) {
      batches.push(variables);
    } else {
      batches.push(createMediaQuery(batch.breakpoint, variables));
    }
  });
  return `:root{ ${batches.join('\n')} }`;
};

export const generateElements = (system: OutputSystem) => {
  const elements: string[] = [];
  system.elements.forEach((element) => {
    element.batchedProperties.forEach((batch) => {
      const blocks: string[] = [];
      batch.values.forEach((group) => {
        const properties: string[] = [];
        group.properties.forEach((property) => {
          const cssValue = property.tokenValue
            ? `var(${createVariableName(
                property.tokenValue.hyphenProperty,
                property.tokenValue.hyphenName
              )})`
            : property.value;
          properties.push(`${property.hyphenName}: ${cssValue};`);
        });

        const modifier = group.modifier ? `[${group.modifier}]` : '';
        const state = group.state || '';
        const selector = `${modifier}${state}`;

        if (selector) {
          blocks.push(
            `${element.hyphenName}${selector}{ ${properties.join('\n')} }`
          );
        } else {
          blocks.push(`${element.hyphenName}{ ${properties.join('\n')} }`);
        }
      });

      const body = blocks.join('\n\n');

      if (batch.breakpoint !== 0) {
        elements.push(createMediaQuery(batch.breakpoint, body));
      } else {
        elements.push(body);
      }
    });
  });
  return elements.join('\n');
};

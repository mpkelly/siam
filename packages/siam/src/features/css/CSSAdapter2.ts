import { PlatformAdapter } from '../adapter/PlatformAdapter';
import { OutputSystem } from '../system/OutputSystem';

export const createCssPlatform = (system: OutputSystem): PlatformAdapter => {
  const assets = [
    {
      name: 'variables.css',
      description: 'System tokens as CSS Variables',
      contents: generateCssVariables(system),
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
      batches.push(`@media (max-width: ${batch.breakpoint}px) { ${variables}}`);
    }
  });
  return `:root{ ${batches.join('\n')} }`;
};

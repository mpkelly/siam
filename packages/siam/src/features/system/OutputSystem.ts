import { System } from './StandardSystem';
import {
  DefaultBreakpoints,
  isBreakpointValues,
} from '../responsive/Breakpoints';
import { isObject } from '../util/Object';

export const createOutputSystem = (system: System): OutputSystem => {
  const breakpoints = system.breakpoints || DefaultBreakpoints;
  const batchedTokens: Batch<BatchToken>[] = [{ breakpoint: 0, values: [] }];
  const groupedTokens: GroupedToken[] = [];

  const { tokens = {} } = system;
  Object.keys(tokens).forEach((property) => {
    const value = tokens[property];
    Object.keys(value).forEach((token) => {
      const tokenValue = value[token];
      if (isObject(tokenValue)) {
        //it's an instance of BreakpointValues
        Object.keys(tokenValue).forEach((breakpoint) => {
          const breakWidth = (breakpoints as any)[breakpoint] as number;
          if (!batchedTokens.find((batch) => batch.breakpoint === breakWidth)) {
            batchedTokens.push({ breakpoint: breakWidth, values: [] });
          }
          const value = (tokenValue as any)[breakpoint];
          batchedTokens
            .find((batch) => batch.breakpoint === breakWidth)
            ?.values.push({ name: token, value, property });
          groupedTokens.push({
            name: token,
            property,
            values: [{ breakpoint: breakWidth, value }],
          });
        });
      } else {
        //it's just a single value for all breakpoints
        batchedTokens[0]?.values.push({
          property,
          name: token,
          value: value[token],
        });
        groupedTokens.push({
          name: token,
          property,
          values: [{ breakpoint: 0, value: value[token] }],
        });
      }
    });
  });

  const elements: Element[] = Object.keys(system.elements || {}).map(
    (element) => {
      const groupedProperties: ElementPropertyGroup[] = [];
      const batchedProperties: Batch<BatchedElementProperty>[] = [
        { breakpoint: 0, values: [] },
      ];

      const findProperties = (root: any, modifier = '', state = '') => {
        Object.keys(root).forEach((property) => {
          const value = (root as any)[property];

          let group = groupedProperties.find(
            (group) => group.modifier === modifier && group.state === state
          );
          if (!group) {
            group = { modifier, state, properties: [] };
            groupedProperties.push(group);
          }
          if (isObject(value)) {
            if (isBreakpointValues(value)) {
              const values = Object.keys(value).map((breakpoint) => {
                return {
                  breakpoint: (breakpoints as any)[breakpoint],
                  value: value[breakpoint],
                };
              });
              group.properties.push({
                name: property,
                values,
              });

              Object.keys(value).forEach((breakpoint) => {
                let batch = batchedProperties.find(
                  (batch) =>
                    batch.breakpoint === (breakpoints as any)[breakpoint]
                );

                if (!batch) {
                  batch = {
                    breakpoint: (breakpoints as any)[breakpoint],
                    values: [],
                  };
                  batchedProperties.push(batch);
                }

                let group = batch.values.find(
                  (group) =>
                    group.modifier === modifier && group.state === group.state
                );
                if (!group) {
                  group = { modifier, state, properties: [] };
                  batch.values.push(group);
                }
                group.properties.push({
                  value: value[breakpoint],
                  name: property,
                });
              });
            } else if (String(property).startsWith(':')) {
              //it's a state
              findProperties(value, modifier, property);
            } else {
              //it's a modifier
              if (modifier) {
                //Combine parent name with modifier type and remove parent group
                property = `${modifier}=${property}`;
                groupedProperties.pop();
              }
              findProperties(value, property, state);
            }
          } else {
            let batchGroup = batchedProperties[0].values.find(
              (value) => value.modifier === modifier && value.state === state
            );
            if (!batchGroup) {
              batchGroup = { modifier, state, properties: [] };
              batchedProperties[0].values.push(batchGroup);
            }
            batchGroup.properties.push({
              name: property,
              value,
            });

            group.properties.push({
              name: property,
              values: [{ breakpoint: 0, value }],
            });
          }
        });
      };
      findProperties((system.elements || {})[element]);
      return { name: element, groupedProperties, batchedProperties };
    }
  );

  return {
    batchedTokens,
    groupedTokens,
    elements,
  } as OutputSystem;
};

interface Batch<T> {
  breakpoint: number;
  values: T[];
}

interface BatchToken {
  name: string;
  value: any;
  property: string;
}

interface GroupedToken {
  name: string;
  property: string;
  values: { breakpoint: number; value: any }[];
}

interface Element {
  name: string;
  groupedProperties: ElementPropertyGroup[];
  batchedProperties: Batch<BatchedElementProperty>[];
}

interface BatchedElementProperty {
  modifier?: any;
  state?: any;
  properties: ElementProperty[];
}

interface ElementProperty {
  name: string;
  value: any;
}

interface ElementPropertyGroup {
  modifier?: any;
  state?: any;
  properties: ElementBreakProperty[];
}

interface ElementBreakProperty {
  name: string;
  values: { breakpoint: number; value: any }[];
}

export interface OutputSystem {
  batchedTokens: Batch<BatchToken>[];
  groupedTokens: GroupedToken[];
  elements: Element[];
}

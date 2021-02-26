import { ExampleSystem } from '../system/StandardSystem';
import { createOutputSystem } from '../system/OutputSystem';
import { createCssPlatform } from './CSSAdapter2';

describe('blah', () => {
  it('works', () => {
    const system = createOutputSystem(ExampleSystem);
    console.log(JSON.stringify(createCssPlatform(system).assets[1], null, 2));
    expect(true).toEqual(true);
  });
});

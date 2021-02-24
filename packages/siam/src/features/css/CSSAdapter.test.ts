import { ExampleSystem } from '../system/StandardSystem';
import { createOutputSystem } from '../system/OutputSystem';

describe('blah', () => {
  it('works', () => {
    const system = createOutputSystem(ExampleSystem);
    console.log(JSON.stringify(system, null, 2));
    expect(2).toEqual(2);
  });
});

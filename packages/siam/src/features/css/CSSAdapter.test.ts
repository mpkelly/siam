import { ExampleSystem } from '../system/StandardSystem';
import { createOutputSystem } from '../system/OutputSystem';

describe('blah', () => {
  it('works', () => {
    console.log(
      JSON.stringify(createOutputSystem(ExampleSystem).elements, null, 2)
    );
    expect(2).toEqual(2);
  });
});

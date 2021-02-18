import { ExampleSystem } from '../system/StandardSystem';
import { CssAdapter } from './CssAdapter';

describe('blah', () => {
  it('works', () => {
    const assets = CssAdapter.generateAssets(ExampleSystem);
    console.log(assets)
    expect(2).toEqual(2);
  });
});

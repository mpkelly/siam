import { ExampleSystem } from '../system/StandardSystem';
import { createOutputSystem } from '../system/OutputSystem';
import { createCssPlatform } from './CSSAdapter';
import { createZipFile } from '../export/Zip';
import { writeFile } from 'fs/promises';

describe('blah', () => {
  it('works', async () => {
    const system = createOutputSystem(ExampleSystem);
    const project = createCssPlatform(system).projects[0];
    const zip = (await createZipFile(project)) as any;
    await writeFile('output/html_css.zip', zip);
    expect(true).toEqual(true);
  });
});

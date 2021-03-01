import JSZip, { OutputType } from 'jszip';
import { Project } from '../platform/Project';

export const createZipFile = async (
  project: Project,
  type: OutputType = 'uint8array'
) => {
  const zip = new JSZip();
  project.assets.forEach((asset) => {
    let path = String(asset.path || '').trim();
    if (path && !path.endsWith('/')) {
      path = path + '/';
    }
    zip.file(`${path}${asset.name}`, asset.contents);
  });
  return zip.generateAsync({ type });
};

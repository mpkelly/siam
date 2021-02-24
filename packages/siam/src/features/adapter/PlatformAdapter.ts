import { Project } from './Project';
import { Asset } from './Asset';

/**
 * Convert a system into something usable for a given platform. Adapters should return
 * `Assets` and `ProjectAssets` as an array. Siam will convert these into a structured zip
 * file according to the `path` specified in each `ProjectAsset`. It's recommended to provide
 * multiple project download options so there is flexibility for the end user.
 */
export type PlatformAdapter = {
  /**
   * Generate a list of assets which can be copied or exported
   * @param system
   */
  assets: Asset[];

  /**
   * Return a list of available projects. Some adapters will offer a single file
   * but others will support structured projects which can be downloaded as zip files.
   */
  projects: Project[];
};

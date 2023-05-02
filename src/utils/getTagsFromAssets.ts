import { Asset } from '~/classes/asset';
import { ascBy, sortBy } from './index';

export const getTagsFromAssets = (assets: Asset[]) =>
  sortBy(
    assets.map((a) => a.find((a) => a.isTag, { includeSelf: true })).flat(),
    ascBy((a) => a.type.name),
    ascBy((a) => a.getPath({ distance: 10 }))
  );

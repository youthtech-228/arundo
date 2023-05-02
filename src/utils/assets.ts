import { Asset } from '~/classes/asset';
import { ProxiedAsset } from '~/classes/assets';
import { DataFetcher } from '~/classes/dataFetcher';
import { LOGGING, TAGDATA_API_URL } from '~/constants';
import humanize from 'humanize-duration';
import { AssetFilter, TagData } from '~/types/assets';
import { Dictionary } from '~/types/utils';
import { crop, getClosestUnit } from './time';
import { error } from '~/services/messages';

export async function getAssetTagData(
  fetcher: DataFetcher,
  assets: Asset[],
  { start, end = new Date(), by, steps }: AssetFilter
): Promise<Array<ProxiedAsset>> {
  if (!start) {
    throw new Error('Bulk data fetching requires a start date');
  }

  if (!by) {
    by = getClosestUnit(+end - +start, steps);
  }

  // crop start/end dates to allow for appropriate caching
  end = crop(end, by.ms);
  start = crop(start, by.ms);
  const duration = +end - +start;

  LOGGING &&
    console.log(
      'determined',
      by.label,
      'as best fit for duration',
      humanize(duration),
      'with',
      duration / by.ms,
      'steps'
    );

  // create new URL
  const url = new URL(TAGDATA_API_URL);

  // add search params for tag data service
  url.searchParams.append('startdate', start.toISOString());
  url.searchParams.append('enddate', end.toISOString());

  if (by.window) {
    url.searchParams.append('window', by.window);
  }

  // add query of tags plus units
  const assetsWithTags = assets.filter((a) => a.isTag);

  // save a look-up-table for reversing the response payload
  const reverseMap = {};

  for (const asset of assetsWithTags) {
    const id = asset?.tagId;

    reverseMap[id] = asset;
    url.searchParams.append(id, asset?.type?.unit || '');
  }

  try {
    const data = await fetcher.get<Dictionary<TagData>>(url.toString());
    for (const [id, assetResponse] of Object.entries(data)) {
      // we save a proxied asset, where asset.data returns data from the response payload
      reverseMap[id] = new Proxy(reverseMap[id], {
        get: (obj, prop) => (prop === 'data' ? assetResponse.data : obj[prop]),
      });
    }

    // return the assets as an array
    return Object.values(reverseMap);
  } catch (err) {
    console.error('BULK TAG DATA ERROR', err);
    error('Could not fetch tag data...');
  }
}

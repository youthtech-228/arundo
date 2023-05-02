import { TAGDATA_API_URL } from '~/constants';
import { ascBy } from '../utils';
import { MarathonItem } from '@arundo/marathon-shared';
import { crop, getClosestUnit, Unit } from '~/utils/time';
import { error } from '~/services/messages';
import { Marathon } from './marathon';

interface AssetPathOptions {
  delimiter?: string;
  distance?: number;
  includeRoot?: boolean;
  from?: Asset;
}

interface AssetDataFilter {
  start: Date;
  end: Date;
  by: Unit;
  steps: number;
}

export interface AssetData {
  id: string;
  isPrimary: boolean;
  name: string;
  slug: string;
  assetTypeId: string;
  isVerified: boolean;
  parentId: string;
  suppressCharts: boolean;
  tagId: string;
}

export class Asset extends MarathonItem {
  public parentId: string;
  public marathon: Marathon;
  public isPrimary: boolean;
  public name: string;
  public slug: string;
  public assetTypeId: string;
  public isVerified: boolean;
  public suppressCharts: boolean;
  public tagId: string;

  private _searches;
  private _descendents;
  private _absolutePath: string;

  constructor(asset: AssetData, marathon: Marathon) {
    super({
      validators: {
        'has:events': (item) => item.events.length,
        'has:children': (item) => item.children.length,
        'is:tag': (item) => item.isTag,
        name: (item, value) =>
          value && item.get('name', '').toLowerCase().indexOf(value) === 0,
        type: (item, value) =>
          value && item.get('type.name', '').toLowerCase().indexOf(value) === 0,
      },
    });

    if (!asset) {
      throw new Error('Asset must be instantiated with a base object');
    }

    if (!marathon.assets) {
      throw new Error(
        'Assets must be instantiated with a parent Assets class hierarchy'
      );
    }

    this.marathon = marathon;

    // define searches
    this._searches = {};

    Object.assign(this, asset);
  }

  get children(): Asset[] {
    return this.marathon.assets.byParent[this.id] || [];
  }

  get parent() {
    return this.marathon.assets.by.id[this.parentId];
  }

  get url() {
    return `/assets/${this.type.slug}/${this.id}`;
  }

  get hasChildren() {
    return !!this.children.length;
  }

  get hasParent() {
    return !!this.parent;
  }

  get isTag() {
    return this.tagId;
  }

  get path() {
    return this.getPath({});
  }

  get type() {
    return this.marathon.assets.types?.by?.id?.[this.assetTypeId];
  }

  public find(
    selector: (value: Asset, index: number, array: Asset[]) => unknown,
    options: { includeSelf?: boolean } = {}
  ): Asset[] {
    const { includeSelf = false } = options;

    return [
      ...new Set(
        [
          includeSelf && [this].filter(selector),
          this.children.filter(selector),
          ...this.children.map((c) => c.find(selector, options)),
        ]
          .flat()
          .filter((a) => a)
      ),
    ];
  }

  getParent() {
    return this.parent;
  }

  // gets data for a tag, based on start & end date (automatically buckets)
  getData(
    { start, end, by, steps = 1000 }: AssetDataFilter = {} as AssetDataFilter
  ) {
    // get closest aggregate period to allow for ~split units between start and end
    if (!by) {
      by = getClosestUnit(+end - +start, steps);
      // console.log('derived by', by)
    } else {
      // console.log('getData was passed by of', by)
    }

    // crop start/end dates to allow for appropriate caching
    end = crop(end, by.ms);
    start = crop(start, by.ms);

    // create new URL
    const url = new URL(TAGDATA_API_URL + '/' + this.tagId);

    // add search params for tag data service
    url.searchParams.append('startdate', start.toISOString());
    url.searchParams.append('enddate', end.toISOString());

    if (by.window) {
      url.searchParams.append('window', by.window);
    }

    // fetch the url
    return this.marathon.fetcher
      .get(url.toString())
      .then((data: { data: unknown }) => data.data || [])
      .catch((err) => {
        console.error('TAG DATA ERROR', err);
        error('Could not fetch tag data...');
      });
  }

  public getPathAsArray({ distance = 99, from = undefined }: AssetPathOptions) {
    const paths: Asset[] = [this];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: Asset = this;
    let distanceTraveled = 0;

    while (
      cursor.parent &&
      distanceTraveled < distance &&
      from !== cursor.parent
    ) {
      paths.unshift((cursor = cursor.parent));

      distanceTraveled++;
    }

    return paths;
  }

  public getPath({ delimiter = ' - ', ...options }: AssetPathOptions): string {
    const paths = this.getPathAsArray(options);

    return paths.map((a) => a.name || a.id).join(delimiter);
  }

  public getAbsolutePath() {
    if (!this._absolutePath) {
      this._absolutePath = this.getPath({});
    }
    return this._absolutePath;
  }

  public getRelativePath(
    from?: Asset,
    options?: Omit<AssetPathOptions, 'from'>
  ) {
    return this.getPath({ ...options, from });
  }

  // clearing search tokens enables next search to generate new tokens, useful for when events change
  clearSearchTokens() {
    delete this._searchTokens;
    return this;
  }

  public setVerify(verified: boolean) {
    try {
      const { isVerified, ...other } = this;

      Object.assign(this, {
        ...other,
        isVerified: verified,
      });

      return true;
    } catch (err) {
      console.error('could not update asset', { obj: this, err });

      return false;
    }
  }

  getChildren({
    deep = false,
    // type = undefined,
    originalRequest = true,
  } = {}): Asset[] {
    if (!deep) {
      return this.children;
    } else if (this._descendents) {
      return this._descendents;
    }

    const descendents = [
      ...this.children,
      ...this.children.map((c) =>
        c.getChildren({ deep: true, originalRequest: false })
      ),
    ]
      .flat()
      .sort(ascBy('name'));

    // cache this result for future requests
    if (originalRequest) {
      this._descendents = descendents;
    }

    return descendents;
  }

  toJSON() {
    const { children, parent, assetTypeId, ...other } = this;

    return {
      ...other,
      children: Array.from(children),
    };
  }
}

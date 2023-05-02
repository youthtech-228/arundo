import { Marathon } from './marathon';
import { MarathonItem } from '@arundo/marathon-shared';
import { ascBy } from '../utils';

export interface AssetTypeData {
  id: string;
  name: string;
  unit?: string;
  slug: string;
  assetViewName: string;
  parentId?: string;
  eventTypeId?: string;
  assetViewId?: string;
  dataSourceId?: string;
  notificationGroupId?: string;
  unitId?: string;
}

interface AssetTypePathOptions {
  delimiter?: string;
  distance?: number;
  includeRoot?: boolean;
  from?: AssetTypeData;
}

export class AssetType extends MarathonItem {
  public name: string;
  public unit?: string;
  public slug: string;
  public parentId: string;
  public eventTypeId: string;
  public assetViewId: string;
  public dataSourceId: string;
  public notificationGroupId: string;
  public unitId: string;
  public assetViewName: string;
  public marathon: Marathon;
  public assetTypeId: string;
  public expanded: boolean;
  private _absolutePath: string;
  private _descendents;
  
  constructor(assetType: AssetTypeData, marathon: Marathon) {
    super();

    if (!assetType) {
      throw new Error('Asset must be instantiated with a base object');
    }

    if (!marathon.assetTypes) {
      throw new Error(
        'Assets must be instantiated with a parent Assets class hierarchy'
      );
    }

    this.marathon = marathon;

    Object.assign(this, assetType);
  }

  get parent() {
    return this.marathon.assetTypes.by.id[this.parentId];
  }

  get url() {
    return `/assetTypes/${this.id}`;
  }

  get hasChildren() {
    return !!this.children.length;
  }

  get path() {
    return this.getPath({});
  }

  get isTag() {
    return this.id;
  }

  get instances() {
    let instances = this.marathon.assets.filter(
      (asset) => asset.assetTypeId === this.id
    );
    return instances;
  }

  // get path() {
  //   return this.getPath({});
  // }
  get children(): AssetType[] {
    return this.marathon.assetTypes.byParent[this.id] || [];
  }

  getChildren({
    deep = false,
    originalRequest = true,
  } = {}): AssetType[] {
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



  public getPathAsArray({
    distance = 99,
    from = undefined,
  }: AssetTypePathOptions) {
    const paths: AssetType[] = [this];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: AssetType = this;
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

  public getPath({
    delimiter = ' - ',
    ...options
  }: AssetTypePathOptions): string {
    const paths = this.getPathAsArray(options);

    return paths.map((a) => a.name || a.id).join(delimiter);
  }

  public getAbsolutePath() {
    if (!this._absolutePath) {
      this._absolutePath = this.getPath({});
    }

    return this._absolutePath;
  }
  public toJSON() {
    return { ...this };
  }
}

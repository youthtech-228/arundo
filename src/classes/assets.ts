import { SlickArray } from 'slick-array';
import { Asset, AssetData } from './asset';
import { AssetTypes } from './assetTypes';
import { Marathon } from './marathon';
import { TimeseriesData } from '~/types/assets';
import { AssetTypeData } from './assetType';
import { LOGGING } from '~/constants';

export class ProxiedAsset extends Asset {
  data: TimeseriesData[];
}

export class Assets extends SlickArray<Asset> {
  public types: AssetTypes;
  private marathon: Marathon;
  private typesLoaded = false;

  constructor(marathon: Marathon) {
    super({
      by: {
        id: (i: Asset) => {
          return i?.id;
        },
      },
      groups: {
        withType: (i: Asset) => i?.assetTypeId,
        byParent: (i: Asset) => i?.parentId,
      },
    });

    this.marathon = marathon;
    this.types = new AssetTypes(marathon);
  }

  public addTypes(types: AssetTypeData[] = []) {
    LOGGING && console.log(`adding ${types.length} asset types`);
    this.types.add(...types);
    this.typesLoaded = true;

    return this;
  }

  public add(...itemsData: Array<AssetData>) {
    // if (!this.typesLoaded) {
    //   throw new Error('Types must be loaded before assets');
    // }

    LOGGING && console.log(`adding ${itemsData.length} assets`);

    const items = itemsData
      .map((item) => new Asset(item, this.marathon))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }

  public findAll(
    selector: (value: Asset, index: number, array: Asset[]) => unknown
  ): Asset[] {
    if (typeof selector !== 'function') {
      throw new Error(
        'Asset.find(selection:function) requires a function (e.g. item => item.isTag)'
      );
    }
    return this.filter(selector);
  }

  public find(selector) {
    const results = this.findAll(selector);

    if (results && results.length) {
      return results[0];
    }
  }

  getRoot() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const roots = this.byParent[undefined] || [];

    return roots.length === 1 ? roots[0] : undefined;
  }

  toJSON() {
    return {
      items: this.map((i) => i?.toJSON?.()),
      types: this.types?.toJSON?.(),
    };
  }
}

import { AssetType, AssetTypeData } from './AssetType';
import { Marathon } from './Marathon';
import { SlickArray } from 'slick-array';

export class AssetTypes extends SlickArray<AssetType> {
  private marathon: Marathon;

  constructor(marathon: Marathon) {
    super({
      by: {
        id: (i: AssetType) => {
          return i?.id;
        },
      },
      groups: {
        byParent: (i: AssetType) => i?.parentId,
      },
    });

    this.marathon = marathon;
  }

  public add(...typesData: Array<AssetTypeData | AssetType>) {
    const types = typesData
      .map((t) => new AssetType(t, this.marathon))
      .filter((item) => !this.by.id[item.id]);
    this.push(...types);
    return this;
  }

  getRoot() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const roots = this.byParent[undefined] || [];

    return roots.length === 1 ? roots[0] : undefined;
  }

  toJSON() {
    return this.map((i) => i?.toJSON());
  }
}

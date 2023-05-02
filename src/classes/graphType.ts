import { Marathon } from './marathon';
import { MarathonItem } from '@arundo/marathon-shared';

export interface GraphCategory {
  id: string,
  insertedAt: Date,
  insertedBy: string,
  updatedAt: Date,
  updatedBy: string,
  name: string,
  xAxisDimension: string,
  yAxisDimension: string
}

export interface AssetGraphType {
  primaryAssetId: string,
  xAxisTagId: string,
  yAxisTagId: string
}

export interface GraphTypeData {
  id: string,
  name: string,
  graphCategory: GraphCategory,
  primaryAssetTypeId: string,
  graphImageId: string,
  xAxisAssetTypeId: string,
  yAxisAssetTypeId: string,
  xAxisUnit: string,
  yAxisUnit: string,
  xAxisMin: number,
  xAxisMax: number,
  yAxisMin: number,
  yAxisMax: number,
  organizationId: string,
  assetGraphTypes: Array<AssetGraphType>
}

export class GraphType extends MarathonItem {
  public name: string;
  public graphCategory: GraphCategory;
  public primaryAssetTypeId: string;
  public graphImageId: string;
  public xAxisAssetTypeId: string;
  public yAxisAssetTypeId: string;
  public xAxisUnit: string;
  public yAxisUnit: string;
  public xAxisMin: number;
  public xAxisMax: number;
  public yAxisMin: number;
  public yAxisMax: number;
  public organizationId: string;
  public assetGraphTypes: Array<AssetGraphType>;

  private readonly marathon: Marathon;

  constructor(graphType: GraphTypeData | GraphType, marathon: Marathon) {
    super();

    this.marathon = marathon;
    Object.assign(this, graphType);
  }

}

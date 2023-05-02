import { UnitData } from './Unit';

interface Parent {
  assetTypeId: string;
  hasIndex: boolean;
  id: string;
  insertedAt: string;
  lowerBound: number;
  organizationId: string;
  parentId: string;
  slug: string;
  unitEnum: string;
  upperBound: number;
}

export interface TagTypeData {
  assetTypeId: string;
  hasIndex: boolean;
  id: string;
  insertedAt: string;
  lowerBound: number;
  organizationId: string;
  parent: Parent | undefined;
  parentId: string;
  slug: string;
  unitEnum: string;
  unit: UnitData | undefined;
  upperBound: number;
}

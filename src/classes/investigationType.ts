import moment from 'moment';
import { Marathon } from './marathon';
import { MarathonItem } from '@arundo/marathon-shared';
import {
  InvestigationTypeData,
  InvestigationPhase,
} from '~/types/investigations';

window.moment = moment;

export class InvestigationType extends MarathonItem {
  public name: string;
  public eventCount: number;
  public assetId: string;
  public description: string;
  public assetTypeId: string;
  public triggerUri: string;
  public phases: Array<InvestigationPhase>;
  public assetType: {
    id: string;
    name: string;
    slug: string;
  };
  public eventTypes: Array<{
    id: string;
    name: string;
  }>;

  private readonly marathon: Marathon;

  constructor(
    investigationType: InvestigationTypeData | InvestigationType,
    marathon: Marathon
  ) {
    super();

    this.marathon = marathon;
    Object.assign(this, investigationType);
  }

  public get asset() {
    return this.marathon.assets?.by?.id[this.assetId];
  }
}

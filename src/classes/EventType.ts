import { Marathon } from './marathon';
import { MarathonItem } from '@arundo/marathon-shared';

export interface EventCode {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  codeType: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
  };
}

export interface EventAssetType {
  id: string;
  assetTypeId: string;
  assetTypeName: string;
  assetTypeSlug: string;
  isContributor: boolean;
  isLatestValue: boolean;
  isPrimary: boolean;
}

export interface EventTypeData {
  color: string;
  createdDate: string;
  description: string;
  id: string;
  name: string;
  severityId: string;
  isAlertStream: boolean;
  visibleToRoles: string[];
  organizationId: string;
}

export class EventType extends MarathonItem {
  public color: string;
  public description: string;
  public name: string;
  public severityId: string;
  public isAlertStream: boolean;
  public visibleToRoles: string[];
  public organizationId: string;

  private readonly marathon: Marathon;

  constructor(eventType: EventTypeData | EventType, marathon: Marathon) {
    super();

    this.marathon = marathon;
    Object.assign(this, eventType);
  }

  get severity() {
    return this.marathon.eventCodes.find(
      (code) => code?.id === this?.severityId
    );
  }
}

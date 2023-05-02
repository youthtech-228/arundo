import { EventCard, Reaction, Severity } from './events';

export enum Status {
  OPEN = 'Open',
  CLOSED = 'Closed',
  IN_PROGRESS = 'InProgress',
  NONE = 'None',
}

export interface InvestigationInstruction {
  id: string;
  imageUri: string;
  index: number;
  text: string;
}
export interface InvestigationStep {
  allowedNextStepIds: string[];
  canCloseInvestigation: boolean;
  description: string;
  id: string;
  instructions: InvestigationInstruction[];
  status: string;
  title: string;
  actionTaken?: string;
  updatedAt?: string;
}

export interface InvestigationPhase {
  id: string;
  name: string;
  steps: InvestigationStep[];
}

export class ResolveWorkflow {
  public steps: InvestigationStep[];

  public constructor(steps: InvestigationStep[]) {
    this.steps = steps;
  }

  public get currentStep(): InvestigationStep | undefined {
    return this.steps.find((s) => s.status === 'Open');
  }

  public get nextSteps(): InvestigationStep[] {
    const allowedNextStepIds = this.currentStep?.allowedNextStepIds;
    return this.steps.filter((s) => allowedNextStepIds?.includes(s.id));
  }
}

export interface InvestigationEvent {
  id: string;
  eventDescription: string;
  startTime: string;
  endTime: string;
  status: Status;
  severity: Severity;
  reaction: Reaction;
  assets: Array<{
    id: string;
    tagId: string;
    isLatestValue: boolean;
  }>;
}

export interface InvestigationData {
  id: string;
  assetId: string;
  name: string;
  description: string;
  organizationId: string;
  status: Status;
  eventCount: number;
  firstObserved: string;
  lastObserved: string;

  events: Array<InvestigationEvent>;
  comments: Array<EventCard>;
  steps: Array<InvestigationStep>;
  assetFullName: string;
}

export interface InvestigationTypeData {
  id: string;
  assetTypeId: string;
  name: string;
  description: string;
  triggerUri: string;
  phases: Array<InvestigationPhase>;
  assetType: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  eventType: Array<{
    id: string;
    name: string;
  }>;
}

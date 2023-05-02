import humanize from 'humanize-duration';
import moment from 'moment';
import { generateHash } from '~/utils';
import { getLargerPeriod } from '~/utils/time';
import { Marathon } from './marathon';
import { MarathonItem } from '@arundo/marathon-shared';
import { EventCard, Severity } from '~/types/events';
import {
  InvestigationData,
  Status,
  ResolveWorkflow,
  InvestigationStep,
} from '~/types/investigations';

window.moment = moment;

export class Investigation extends MarathonItem {
  public name: string;
  public organizationId: string;
  public comments: Array<EventCard>;
  public events: InvestigationData['events'];
  public eventCount: number;
  public assetId: string;
  public description: string;
  public steps: Array<InvestigationStep>;

  public firstObserved: string;
  public lastObserved: string;
  public status: Status;
  public severity: Severity;
  public resolveWorkflow: ResolveWorkflow;

  private readonly marathon: Marathon;

  constructor(
    investigation: InvestigationData | Investigation,
    marathon: Marathon
  ) {
    super({
      validators: {
        // 'is:pending': (item: Investigation) => item.isPending,
        // 'is:active': (item: Investigation) => item.isActive,
        'is:open': (item: Investigation) => item.isOpen,
        'is:resolved': (item: Investigation) => item.isResolved,
        'has:comments': (item: Investigation) =>
          item.comments && item.comments.length,
        'commented:self': (item: Investigation) => {
          return item?.comments?.reduce(
            (acc, c) =>
              acc || c.createdUserFullName === item.marathon.activeUser.name,
            false
          );
        },
        'tagged:self': (item: Investigation) => {
          const activeUserFullName =
            item.marathon.activeUser.firstName +
            ' ' +
            item.marathon.activeUser.lastName;
          return item?.comments?.reduce(
            (acc, c) => acc || c.comment.includes('@' + activeUserFullName),
            false
          );
        },
      },
    });

    this.marathon = marathon;
    this.id = generateHash();

    this.resolveWorkflow = new ResolveWorkflow(investigation.steps);

    this.update(investigation);
  }

  public get asset() {
    return this.marathon.assets?.by?.id[this.assetId];
  }

  public get isActive() {
    return this.status === 'InProgress';
  }

  public get isPending() {
    return this.status === 'Open' || this.status === 'None';
  }

  public get isOpen() {
    return (
      this.status === 'Open' ||
      this.status === 'InProgress' ||
      this.status === 'None'
    );
  }

  public get isResolved() {
    return this.status === 'Closed';
  }

  public get statusName() {
    switch (this.status) {
      case 'InProgress':
        return 'In Progress';
      case 'Closed':
        return 'Resolved';
      case 'None':
      case 'Open':
        return 'Pending';
      default:
        return this.status;
    }
  }

  public get start() {
    return +new Date(this.firstObserved) || undefined;
  }

  public get end() {
    return +new Date(this.lastObserved) || undefined;
  }

  public addComment(card: EventCard) {
    this.comments.push(card);
  }

  public updateComment({ id, comment }) {
    const card = this.comments.find((c) => c.id === id);
    card.comment = comment;
  }

  public deleteComment(id: string) {
    this.comments = this.comments.filter((e) => e.id !== id);
  }

  public getSearchTokens() {
    if (this._searchTokens) {
      return this._searchTokens;
    }

    const name = this.get('name', '').toLowerCase();

    this._searchTokens = [
      name,
      ...name.split(' '),
      ...this.asset.getSearchTokens(),
    ].filter((v) => v);

    return this._searchTokens;
  }

  public update(
    investigation: InvestigationData | Investigation = {} as InvestigationData
  ) {
    try {
      const before = JSON.stringify(this);

      Object.assign(this, investigation);

      return before === JSON.stringify(this) ? 0 : 1;
    } catch (err) {
      console.error('could not update investigation', {
        obj: this,
        investigation,
        err,
      });

      return false;
    }
  }

  private get duration(): number {
    return this.end - this.start;
  }

  public get durationAsString() {
    return this.duration
      ? humanize(this.duration, { largest: 2, round: true })
      : '-';
  }
  public get url() {
    const date = new Date(+this.start + this.duration / 2);
    const closestUnit = getLargerPeriod(this.duration);

    return `/investigations/${
      this.id
    }?date=${date.toISOString()}&direction=center&period=${closestUnit.slug}`;
  }

  public toJSON() {
    const {
      asset,
      assets,
      assetKeys,
      marathon,
      validators,
      _assets,
      ...other
    } = this as unknown as { [key: string]: unknown };

    return other;
  }
}

import { GetTokenSilentlyOptions } from '@auth0/auth0-react';
import { Assets } from './assets';
import { Auth0User } from './Auth0User';
import { DataFetcher } from './DataFetcher';
import { AssetTypes } from './assetTypes';
import { EventTypes } from './EventTypes';
import { EventCode } from './EventType';
import { Users } from './users';
import { InvestigationTypes } from './investigationTypes';
import { Groups } from './Groups';
import { GraphTypes } from './graphTypes';

interface MarathonOptions {
  refreshUI?: () => void;
  getToken: (options?: GetTokenSilentlyOptions) => Promise<string>;
}

export class Marathon {
  public assets: Assets;
  public activeUser: Auth0User;
  public refreshUI: () => void;
  public fetcher: DataFetcher;
  public assetTypes: AssetTypes;
  public eventTypes: EventTypes;
  public eventCodes: EventCode[];
  public eventRolesList: string[];
  public users: Users;
  public groups: Groups;
  public investigationTypes: InvestigationTypes;
  public graphTypes: GraphTypes;
  private getToken: (options?: GetTokenSilentlyOptions) => Promise<string>;

  private refreshTimer: NodeJS.Timeout;

  constructor({ refreshUI = () => null, getToken }: MarathonOptions) {
    this.assets = new Assets(this);
    this.assetTypes = new AssetTypes(this);
    this.eventTypes = new EventTypes(this);
    this.users = new Users(this);
    this.groups = new Groups(this);
    this.investigationTypes = new InvestigationTypes(this);
    this.graphTypes = new GraphTypes(this);
    this.activeUser = undefined;
    this.eventCodes = [];
    this.eventRolesList = [];
    this.refreshUI = refreshUI;
    this.fetcher = new DataFetcher(getToken);
  }

  refresh() {
    if (this.refreshUI && !this.refreshTimer) {
      this.refreshTimer = setTimeout(() => {
        console.log('refreshing Marathon...');
        delete this.refreshTimer;
        this.refreshUI();
      }, 10);
    }
  }
}

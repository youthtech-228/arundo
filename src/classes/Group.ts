import { MarathonItem } from '@arundo/marathon-shared';
import { User } from './User';

export interface GroupData {
  id: string;
  name: string;
  description: string;
  users: Array<User>;
  insertedAt: Date;
}

export class Group extends MarathonItem {
  public name: string;
  public description: string;
  public users: Array<User>;
  public insertedAt: Date;

  constructor(group) {
    super();
    Object.assign(this, group);
  }
}

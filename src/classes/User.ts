import { MarathonItem } from '@arundo/marathon-shared';

interface UserGroup {
  description: string;
  is: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ProductScope {}

export interface UserData {
  createdDate: Date;
  email: string;
  firstName: string;
  groups: Array<UserGroup>;
  groupIds: Array<string>;
  id: string;
  insertedAt: Date;
  updatedAt: Date;
  isFederated: boolean;
  invitedAt: Date;
  activatedAt: Date;
  lastInvitedDate: Date;
  lastName: string;
  lastSuccessfulLogin: Date;
  productScope: ProductScope;
  productScopeId: string;
  status: string;
  userId: string;
}

export class User extends MarathonItem {
  public email: string;
  public firstName: string;
  public groups: Array<UserGroup>;
  public groupIds: Array<string>;
  public updatedAt: Date;
  public insertedAt: Date;
  public isFederated: boolean;
  public invitedAt: Date;
  public lastInvitedDate: Date;
  public activatedAt: Date;
  public lastName: string;
  public lastSuccessfulLogin: Date;
  public productScope: ProductScope;
  public productScopeId: string;
  public status: string;
  public userId: string;

  constructor(user) {
    super();
    Object.assign(this, user);
  }

  public setStatus(newStatus: string) {
    try {
      const { status, ...other } = this;

      Object.assign(this, {
        ...other,
        status: newStatus,
      });

      return true;
    } catch (err) {
      console.error('could not update user', { obj: this, err });

      return false;
    }
  }
  public updateUser(
    firstName: string,
    lastName: string,
    groups: [object],
    groupIds: [string]
  ) {
    try {
      const { ...other } = this;

      Object.assign(this, {
        ...other,
        firstName: firstName,
        lastName: lastName,
        groups: groups,
        groupIds: groupIds,
      });

      return true;
    } catch (err) {
      console.error('could not update user', { obj: this, err });

      return false;
    }
  }
}

import { User } from '@auth0/auth0-react';

const CLAIM_URL_BASE = 'https://arundo.com';

export class Auth0User extends User {
  public constructor(user: User) {
    super();
    Object.assign(this, user);
  }

  public get employeeId() {
    return this?.[`${CLAIM_URL_BASE}/claim/employeeId`];
  }

  public get firstName() {
    return this?.[`${CLAIM_URL_BASE}/claim/firstName`];
  }

  public get lastName() {
    return this?.[`${CLAIM_URL_BASE}/claim/lastName`];
  }

  public get orgId() {
    return this?.[`${CLAIM_URL_BASE}/claim/orgId`];
  }

  public get position() {
    return this?.[`${CLAIM_URL_BASE}/claim/position`];
  }

  public get userId() {
    return this?.[`${CLAIM_URL_BASE}/claim/userId`];
  }

  public get company() {
    return this?.[`${CLAIM_URL_BASE}/company`];
  }
}

import { SlickArray } from 'slick-array';
import { User, UserData } from './User';
import { Marathon } from './marathon';
import { LOGGING } from '~/constants';

export class Users extends SlickArray<User> {
  private marathon: Marathon;

  public constructor(marathon: Marathon) {
    super({
      as: (user: User) => new User(user),
      by: {
        id: (u: User) => u.id,
        email: (u: User) => u.email,
        name: (u: User) => u.firstName + ' ' + u.lastName,
      },
    });

    this.marathon = marathon;
  }

  public add(...itemsData: Array<UserData>) {
    LOGGING && console.log(`adding ${itemsData.length} users`);

    const items = itemsData
      .map((item) => new User(item))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }
}

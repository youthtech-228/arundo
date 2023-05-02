import { SlickArray } from 'slick-array';
import { Group, GroupData } from './Group';
import { Marathon } from './marathon';
import { LOGGING } from '~/constants';

export class Groups extends SlickArray<Group> {
  private marathon: Marathon;

  public constructor(marathon: Marathon) {
    super({
      as: (group: Group) => new Group(group),
      by: {
        id: (g: Group) => g.id,
        name: (g: Group) => g.name,
      },
    });

    this.marathon = marathon;
  }

  public add(...itemsData: Array<GroupData>) {
    LOGGING && console.log(`adding ${itemsData.length} groups`);

    const items = itemsData
      .map((item) => new Group(item))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }
}

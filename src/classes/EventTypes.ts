import { SlickArray } from 'slick-array';
import { LOGGING } from '~/constants';
import { EventType, EventTypeData } from './EventType';
import { Marathon } from './marathon';

export class EventTypes extends SlickArray<EventType> {
  private marathon: Marathon;

  constructor(marathon: Marathon) {
    super({
      as: (event: EventType) => {
        return new EventType(event, marathon);
      },
      by: {
        id: (eventType: EventType) => eventType.id,
      },
    });

    this.marathon = marathon;
  }

  public add(...itemsData: Array<EventTypeData | EventType>) {
    LOGGING && console.log(`adding ${itemsData.length} eventTypes`);

    const items = itemsData
      .map((item) => new EventType(item, this.marathon))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }
}

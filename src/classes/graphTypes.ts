import { SlickArray } from 'slick-array';
import { LOGGING } from '~/constants';
import { GraphType, GraphTypeData } from './graphType';
import { Marathon } from './marathon';

export class GraphTypes extends SlickArray<GraphType> {
  private marathon: Marathon;

  constructor(marathon: Marathon) {
    super({
      as: (event: GraphType) => {
        return new GraphType(event, marathon);
      },
      by: {
        id: (eventType: GraphType) => eventType.id,
      },
    });

    this.marathon = marathon;
  }

  public add(...itemsData: Array<GraphTypeData | GraphType>) {
    LOGGING && console.log(`adding ${itemsData.length} graphTypes`);

    const items = itemsData
      .map((item) => new GraphType(item, this.marathon))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }
}

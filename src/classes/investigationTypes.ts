import { SlickArray } from 'slick-array';
import { LOGGING } from '~/constants';
import { InvestigationTypeData } from '~/types/investigations';
import { InvestigationType } from './investigationType';
import { Marathon } from './marathon';

export class InvestigationTypes extends SlickArray<InvestigationType> {
  private marathon: Marathon;

  constructor(marathon: Marathon) {
    super({
      as: (event: InvestigationTypeData) => {
        return new InvestigationType(event, marathon);
      },
      by: {
        id: (investigationType: InvestigationType) => investigationType.id,
      },
    });

    this.marathon = marathon;
  }

  public add(...itemsData: Array<InvestigationTypeData | InvestigationType>) {
    LOGGING && console.log(`adding ${itemsData.length} investigationTypes`);

    const items = itemsData
      .map((item) => new InvestigationType(item, this.marathon))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }
}

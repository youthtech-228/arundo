import { SlickArray } from 'slick-array';
import { LOGGING } from '~/constants';
import { InvestigationData } from '~/types/investigations';
import { Investigation } from './investigation';
import { Marathon } from './marathon';

export interface EventCode {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  codeType: {
    id: string;
    name: string;
    description: string;
    createdDate: string;
  };
}

export class Investigations extends SlickArray<Investigation> {
  private marathon: Marathon;

  constructor(marathon: Marathon) {
    super({
      as: (event: InvestigationData) => {
        return new Investigation(event, marathon);
      },
      by: {
        id: (investigation: Investigation) => investigation.id,
      },
    });

    this.marathon = marathon;
  }

  public mergeAndCountChanges(
    ...investigations: (InvestigationData | Investigation)[]
  ) {
    let changes = 0;
    const investigationsToAdd = investigations.filter((e) => !this.by.id[e.id]);
    const investigationsToUpdate = investigations.filter(
      (e) => this.by.id[e.id]
    );

    if (investigationsToAdd.length) {
      LOGGING &&
        console.log(`adding ${investigationsToAdd.length} investigations`);
      this.add(...(investigationsToAdd as Investigation[]));
      changes += investigationsToAdd.length;
    }

    if (investigationsToUpdate.length) {
      console.log(`updating ${investigationsToUpdate.length} investigations`);
      for (const investigation of investigationsToUpdate) {
        const matched = this.by.id[investigation.id];

        if (matched?.update) {
          changes += Number(matched.update(investigation));
        }
      }
    }
    return changes;
  }

  public add(...itemsData: Array<InvestigationData | Investigation>) {
    LOGGING && console.log(`adding ${itemsData.length} investigations`);

    const items = itemsData
      .map((item) => new Investigation(item, this.marathon))
      .filter((item) => !this.by.id[item.id]);

    this.push(...items);

    return this;
  }

  public toJSON() {
    return this.map((e) => e.toJSON?.());
  }
}

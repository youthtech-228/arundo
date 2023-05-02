import React, { ReactNode } from 'react';
import { Dictionary } from '~/types/utils';
import {
  Badge,
  FilterDescription,
  FilterName,
  HelperPanel,
  Title,
} from './components';

export interface HintObject {
  description: ReactNode;
  label: string;
  type?: string;
  group?: string;
}

interface Props {
  hints: Dictionary<HintObject>;
}

export const SearchHints = React.memo(function searchHints({ hints }: Props) {
  if (hints && !Object.keys(hints).length) {
    return null;
  }

  return (
    <HelperPanel>
      <Title>SEARCH HINTS</Title>
      <table>
        <tbody>
          {Object.keys(hints).map((name) => (
            <tr key={name}>
              <FilterName>
                <Badge>{`${name}`}</Badge>
              </FilterName>
              <FilterDescription>{hints[name].description}</FilterDescription>
            </tr>
          ))}
        </tbody>
      </table>
    </HelperPanel>
  );
});

SearchHints.displayName = 'SearchHints';

// import React from 'react';
import styled, { css } from 'styled-components';
import { MarathonItem } from '@arundo/marathon-shared';
import {
  SearchBar as SearchBarBase,
  Props as SearchBarProps,
} from './searchBar';
import React, { useEffect, useState } from 'react';
import { useQuery } from '~/contexts/queryContext';

const SearchBar = styled(SearchBarBase)``;

const Contents = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Container = styled.section<{ fullscreenTimeseries?: boolean }>`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: stretch;

  overflow-y: hidden;

  & > ${SearchBar} {
    box-shadow: var(--drop-shadow);
  }
  & > :last-child:not(${SearchBar}) {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: 'content aside';
    position: relative;
    overflow: auto;

    & > *:not(aside) {
      grid-area: content;
      ${({ fullscreenTimeseries: fullscreenMode }) =>
        fullscreenMode &&
        css`
          & > :not(.fullscreen) {
            display: none;
          }
        `}
    }

    & > aside {
      grid-area: aside;
    }
  }
`;

interface NewProps<T extends MarathonItem> extends SearchBarProps<T> {
  category: string;
  sortResults: (items: T[]) => T[];
  resultsRenderer: (items: T[]) => JSX.Element;
  children: React.ReactChild;
  showResults?: boolean;
}

export const PageWithSearch = <T extends MarathonItem>({
  resultsRenderer: renderResults,
  sortResults,
  searchHook,
  children,
  showResults = false,
  ...searchProps
}: NewProps<T>) => {
  const {
    query: { fullscreen },
  } = useQuery();
  const { isSearching, results } = searchHook;
  const [sortedResults, setSortedResults] = useState(sortResults(results));

  useEffect(() => {
    setSortedResults(sortResults(results));
  }, [results]);

  return (
    <Container fullscreenTimeseries={!!fullscreen}>
      {!fullscreen && <SearchBar searchHook={searchHook} {...searchProps} />}

      {isSearching || showResults ? (
        <Contents>{renderResults(sortedResults)}</Contents>
      ) : (
        children
      )}
    </Container>
  );
};

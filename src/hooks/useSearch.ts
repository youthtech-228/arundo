import { useLocation } from 'react-router';
import memoizeOne from 'memoize-one';
import { useEffect, useRef, useState } from 'react';
import { useStore } from './useStore';

const highlight = memoizeOne<(tokens: string[]) => (str: string) => string>(
  (tokens) => {
    const matcher = new RegExp(`(${tokens.join('|')})`, 'gi');
    return (str) =>
      typeof str === 'string' ? str.replace(matcher, '<mark>$1</mark>') : str;
  }
);

interface SearchState {
  terms: string;
  config: unknown;
  tokens: Array<string>;
  fromSearch?: boolean;
}

interface Props<T> {
  namespace: string;
  items: Array<T>;
  initial?: SearchState;
}

export const useSearch = <T>(
  {
    namespace = 'search',
    items: searchItems,
    initial = {} as SearchState,
  }: Props<T> = {} as Props<T>
) => {
  const location = useLocation();
  const [searchState, setSearchState] = useStore<SearchState>(
    namespace,
    Object.assign(
      {
        terms: '',
        config: {},
        tokens: [],
        fromSearch: false,
      },
      initial
    )
  );

  const [results, setResults] = useState<Array<T>>([]);
  const previousTerms = useRef('');
  const previousItems = useRef([]);
  const { config, terms, tokens } = searchState;
  const [isSearching, setIsSearching] = useState(false);
  // returnToSearch is set to a function if conditions are met
  const returnToSearch = searchState.fromSearch && (() => setIsSearching(true));
  // !isSearching && (tokens?.length || !isEqual(initial.filters || [], filters)) && (() => setIsSearching(true))
  const navigateFromSearch = () => {
    setSearchState({
      ...searchState,
      fromSearch: true,
    });
    setIsSearching(false);
  };

  const setTerms = (value) => {
    setSearchState({
      ...searchState,
      terms: value,
      tokens: (
        value
          .toLowerCase()
          .replace(/[\\?*()[\]]/g, '')
          .match(/((\w+:)?"[^"]+")|([^\s]+)/gi) || []
      ).map((s) => s.replace(/"/g, '')),
    });
  };

  const createObjectMap = (array = [], attr = 'id') =>
    array.reduce((acc, i) => {
      acc[i[attr]] = i;
      return acc;
    }, {});

  const resultsAreDifferent = (a, b) => {
    // if the arrays are diff length, something is different
    if (a.length !== b.length) return true;

    const bMap = createObjectMap(b);

    // for each entry in one, check if in map of the other
    for (const i of a) {
      if (!bMap[i.id]) return true;
    }
  };

  const searchTermListener = (items = []) => {
    // no search, reset to all results
    if (!tokens.length) {
      setResults(searchItems);
    } else {
      const newSearchedResults = items.filter((item) =>
        item.matches([...tokens], config)
      );

      if (resultsAreDifferent(newSearchedResults, results)) {
        setResults(newSearchedResults);
      }
    }

    previousItems.current = searchItems;
  };

  let timer = undefined;

  // USEEFFECT: re-search items when underlying items or search terms change
  useEffect(() => {
    searchTermListener(searchItems);
  }, [terms]);
  // if search changes (terms or filters), turn search results on
  useEffect(() => {
    if (tokens.length) {
      !isSearching && setIsSearching(true);
    } else {
      isSearching && setIsSearching(false);
    }
  }, [tokens]);

  // turn search results off if any navigation happens (all clicks to new URL should remove search)
  useEffect(() => {
    isSearching && setIsSearching(false);
  }, [location]);

  useEffect(() => {
    clearTimeout(timer);

    if (searchItems !== previousItems.current) {
      searchTermListener(searchItems);
    } else {
      if (isSearching) {
        previousTerms.current = terms;
        timer = setTimeout(() => searchTermListener(searchItems), 0);
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [terms, isSearching, searchItems]);

  return {
    config,
    highlighter: tokens.length && highlight(tokens),
    isSearching,
    results,
    returnToSearch,
    navigateFromSearch,
    setResults,
    setTerms,
    setIsSearching,
    terms,
    tokens,
  };
};

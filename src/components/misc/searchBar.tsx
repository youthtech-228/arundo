import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useClickOutside } from '~/hooks/useClickOutside';
import { useSearch } from '~/hooks/useSearch';

export const StyledSearchBar = styled.section`
  background-color: #616161;
  padding: 0.7em;
  flex: 0 0%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  color: #fff;
  align-items: center;
  position: relative;

  a {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  > *:not(:first-child) {
    margin-left: 0.5em;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border-radius: 0.3rem;
  padding: 0.2em 0.4em 0.1em;
  font-size: 1.4rem;
  border: 0;
  background: #777;
  color: white;
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s ease;

  & + label {
    display: none;
    position: absolute;
    right: 0;
    text-align: right;
    text-transform: uppercase;
    font-size: 0.8em;
    line-height: 1.1em;
    font-weight: 600;
    color: #ddd;
    margin-right: 0.5em;
    margin-bottom: -0.25em;
    z-index: 0;
    width: 6rem;
  }

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    box-shadow: none;
    outline: none;
    border: none;
  }

  &:not(:placeholder-shown) {
    margin-left: 4.5rem;

    & + label {
      display: block;
      right: calc(100% - 4.5rem);
    }
  }
`;

export const SearchboxWithLabel = styled.div`
  position: relative;
  flex: 1;
  max-width: 30rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  height: 44px;
`;

class SearchTypeWrapper<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,class-methods-use-this
  wrapped(e: any) {
    return useSearch<T>(e);
  }
}
export interface Props<T> {
  category?: string;
  placeholder?: string;
  label?: string;
  autofocus?: boolean;
  searchHook: ReturnType<SearchTypeWrapper<T>['wrapped']>;
  className?: string;
}

export const SearchBar = <T,>({
  category = 'items',
  placeholder,
  label,
  autofocus = false,
  searchHook,
  className = '',
}: Props<T>) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [showHelper, setShowHelper] = useState(false);
  const { terms, setTerms } = searchHook;

  useClickOutside(inputRef, () => setShowHelper(false));

  useEffect(() => {
    if (autofocus) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (showHelper && terms) {
      setShowHelper(false);
    }
  }, [terms]);

  return (
    <StyledSearchBar className={`${className} search`} ref={containerRef}>
      <SearchboxWithLabel>
        <SearchInput
          ref={inputRef}
          placeholder={placeholder || `Search ${category}...`}
          value={terms}
          onClick={() => {
            if (terms) return;
            setShowHelper(true);
          }}
          onChange={(e) => {
            const terms = e.target.value;
            setTerms(terms);
            if (!terms) {
              setShowHelper(true);
            }
          }}
        />
        <label>{label || `Searching ${category}`}</label>
      </SearchboxWithLabel>
    </StyledSearchBar>
  );
};

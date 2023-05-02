import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchIcon from '~/images/search_icon.svg';
import { useSearch } from '~/hooks/useSearch';

const Input = styled.input`
  border-top: none;
  border-left: none;
  border-right: none;
  min-width: 320px;
  width: 100%;
  line-height: 2.4em;
  overflow-x: hidden;
  overflow-y: hidden !important;
  transition: 0.3s;
  padding-left: 30px;
  &:focus {
    outline: none;
  }
  border-bottom: 1px solid #000000;
`;

const StyledInput = styled.div`
  &.inputWithIcon {
    position: relative;
  }

  .left-icon {
    width: 50px;
    position: relative;
    left: 5px;
    top: -20px;
    transform: translateY(-30%);
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
  searchHook: ReturnType<SearchTypeWrapper<T>['wrapped']>;
}

export const SearchInput = <T,>({
  category = 'Search',
  searchHook,
}: Props<T>) => {
  const [showHelper, setShowHelper] = useState(false);
  const { terms, setTerms } = searchHook;

  useEffect(() => {
    if (showHelper && terms) {
      setShowHelper(false);
    }
  }, [terms]);

  return (
    <StyledInput className={'inputWithIcon'}>
      <Input
        type="text"
        placeholder={`${category}`}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        value={terms}
        onChange={(e) => {
          const terms = e.target.value;
          setTerms(terms);
          if (!terms) {
            setShowHelper(true);
          }
        }}
      />
      <div className="left-icon">
        <img src={SearchIcon} />
      </div>
    </StyledInput>
  );
};

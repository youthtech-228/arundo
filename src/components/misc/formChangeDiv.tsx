import React from 'react';
import styled from 'styled-components';

const DisplayChangedNumbeDiv = styled.div`
  width: 94%;
  flex-grow: 0;
  max-width: 94%;
  flex-basis: 94%;
`;

const DisplayChangedNumber = styled.div`
  grid-column: 1;
  display: flex;
  flex-flow: wrap;
  align-items: flex-start;
  align-content: center;
  justify-content: flex-end;

  > * {
    margin-left: 1em;
  }
`;

export const SearchDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const FormChangeDiv = ({ text }) => {
  return (
    <DisplayChangedNumbeDiv>
      <DisplayChangedNumber>
        {text}
      </DisplayChangedNumber>
    </DisplayChangedNumbeDiv>
  );
};

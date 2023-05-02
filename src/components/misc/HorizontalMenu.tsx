import React from 'react';
import styled from 'styled-components';

const StyledMenu = styled.nav`
  display: flex;
  flex-flow: row wrap;
  text-transform: uppercase;
  margin-right: 0;
  align-self: stretch;
  align-items: stretch;
  justify-content: flex-end;

  a {
    color: #aaa;
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    padding: 0.3em 1.2em;

    &:focus:after {
      display: none;
    }

    &.active {
      color: rgb(251, 126, 35);
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.07);
    }
  }
`;

export const HorizontalMenu = ({ children, ...props }) => {
  return <StyledMenu {...props}>{children}</StyledMenu>;
};

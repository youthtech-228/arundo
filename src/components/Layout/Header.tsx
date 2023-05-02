import { NavLink } from '@arundo/marathon-shared';
import React from 'react';
import styled from 'styled-components';
import logo from '~/images/logo.svg';

export const StyledHeader = styled.header`
  background-color: #222;
  color: #fff;
  box-shadow: 0 0.2em 0.5em rgba(0, 0, 0, 0.4);
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;

  img {
    margin: 1rem 1.2rem;
  }

  a {
    color: #aaa;
    font-weight: bold;
  }
`;

export const Header = styled(({ children, className }) => (
  <StyledHeader className={className}>
    <NavLink to="/">
      <img src={logo} />
    </NavLink>

    {children}
  </StyledHeader>
))``;

import React from 'react';
import styled from 'styled-components';
import { NavLink } from '@arundo/marathon-shared';
import { Submenu } from '~/components/misc/Submenu';

const StyledPage = styled.div`
  width: 100%;
`;

export const PageWithSubmenu = ({ children, menuItems = [], ...props }) => {
  return (
    <StyledPage {...props}>
      <Submenu>
        {menuItems.map((item, key) => (
          <NavLink to={item.to} key={key}>
            {item.label}
          </NavLink>
        ))}
      </Submenu>
      {children}
    </StyledPage>
  );
};

import React from 'react';
import styled from 'styled-components';
import { HorizontalMenu } from '~/components/misc/HorizontalMenu';

const StyledSubmenu = styled.div`
  height: 3rem;
  background-color: rgb(97, 97, 97);
  display: flex;
  justify-content: flex-end;
  padding-right: 3.8rem;
`;

export const Submenu = ({ children, ...props }) => {
  return (
    <StyledSubmenu {...props}>
      <HorizontalMenu>{children}</HorizontalMenu>
    </StyledSubmenu>
  );
};

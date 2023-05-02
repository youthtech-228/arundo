import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Toasts } from './toasts';
import { Navigation } from './TopNavigation';

const Layout = styled.div`
  display: grid;
  grid-template-areas: 'header header' 'aside main';
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;

  height: 100vh;
  width: 100vw;
  justify-content: stretch;

  & > * {
    position: relative;
    overflow: hidden;
  }

  & > header {
    grid-area: header;
  }
  & > aside {
    grid-area: aside;
  }
  & > main {
    grid-area: main;
  }
`;

export const AppLayout = ({ children, isLoggedIn }) => {
  return (
    <Layout>
      <Header>
        <Navigation isLoggedIn={isLoggedIn} />
      </Header>
      {children}
      <Toasts />
    </Layout>
  );
};

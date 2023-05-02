import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import { AppLayout } from '~/components/Layout/AppLayout';
import { ContentSection } from '~/components/Layout/contentSection';
import { MarathonProvider } from '~/contexts/marathonContext';
import { QueryProvider } from '~/contexts/queryContext';
import { useAuth } from '~/hooks/useAuth';
import { MainContent } from './LoggedIn';
import { Button } from '@arundo/marathon-shared';

const LoginPage = styled(ContentSection)`
  margin-bottom: 5rem;
  color: #aaa;
  height: 100%;
`;

const Main = styled.main`
  overflow-y: hidden;
  padding: 0;
  height: 100%;
`;

const AuthWrapper = ({
  isLoading,
  isAuthenticated,
  loginWithRedirect,
}: ReturnType<typeof useAuth>) => {
  if (isLoading) return null;

  if (!isAuthenticated)
    return (
      <Main>
        <LoginPage centered>
          <h2>Welcome to Marathon</h2>
          <h6>
            Please <Button onClick={loginWithRedirect}>Sign In</Button> to
            continue...
          </h6>
        </LoginPage>
      </Main>
    );

  return <MainContent />;
};

export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <QueryProvider>
        <MarathonProvider>
          <AppLayout isLoggedIn={auth.isAuthenticated}>
            <AuthWrapper {...auth} />
          </AppLayout>
        </MarathonProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

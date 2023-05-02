import { IconButton } from '@arundo/marathon-shared';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Input from '@material-ui/icons/Input';
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '~/hooks/useAuth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #eee;
  color: black;
  position: fixed;
  justify-content: center;
  padding: 0em 1.2em;
  width: 12em;
  height: 6em;
  top: 4em;
  right: 1.2em;
  border: 0.1em solid lightgrey;
  border-radius: 0.3rem 0.3rem 0.6rem 0.6rem;
  box-shadow: 0 0.1em 2em rgba(0, 0, 0, 0.1);
  z-index: 1001;

  > *:first-child {
    margin-bottom: 1em;
  }
`;

const Shield = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(100, 100, 100, 0.2);
  cursor: default;
  z-index: 1000;
`;

export const Profile = ({ closeHandler }) => {
  const { logout: logoutAction } = useAuth();

  return (
    <>
      <Container>
        <IconButton
          onClick={() =>
            window.open('https://docs.marathon.arundo.com', '_blank')
          }
          icon={HelpOutline}
        >
          Help guides
        </IconButton>
        <IconButton
          icon={Input}
          onClick={() =>
            logoutAction({
              returnTo: window.location.origin,
            })
          }
        >
          Sign out
        </IconButton>
      </Container>

      <Shield onClick={closeHandler} />
    </>
  );
};

import { IconButton, NavLink } from '@arundo/marathon-shared';
import AccountCircle from '@material-ui/icons/AccountCircle';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Profile } from '~/components/misc/profile';
import { useAuth } from '~/hooks/useAuth';

const StyledNavigation = styled.nav`
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
      // color: #fff;
      // background-color: rgba(251, 126, 35, 0.8);

      // color: #fff;
      // background-color: rgba(255, 0, 200, 1);
      // color: white;

      color: rgb(251, 126, 35);
      // cursor: default;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.07);
    }
  }

  > * {
    &:not(:last-child) {
      // margin-right: 1.2em;
    }
  }

  > a:last-child {
    &:hover {
      color: #eee;
    }
  }

  > * + a:last-child {
    color: #555;
    border-left: 1px solid #444;
    flex: 0;
    line-height: 1em;
    text-align: center;
    padding: 0.3em 1.4em;
  }
`;

const StyledProfileIcon = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
`;

export const Navigation = ({ isLoggedIn }) => {
  const { loginWithRedirect: loginAction } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <StyledNavigation>
      {isLoggedIn && (
        <>
          <NavLink to={'/assetTypes'}>Assets</NavLink>
          <NavLink to="/events/types">Events</NavLink>
          <NavLink to="/investigations">Investigations</NavLink>
          <NavLink to="/graphs">Graphs</NavLink>
          <NavLink to="/tags/types">Tags</NavLink>
          <NavLink to="/models/lists">Models</NavLink>
          <NavLink to={'/users/users'}>Users</NavLink>
          <NavLink to="/uploads/tags">Uploads</NavLink>
        </>
      )}

      {isLoggedIn ? (
        <StyledProfileIcon>
          <IconButton onClick={handleProfile}>
            <AccountCircle />
          </IconButton>
        </StyledProfileIcon>
      ) : (
        <NavLink to={null} onClick={loginAction}>
          Sign In
        </NavLink>
      )}
      {showProfile ? (
        <Profile closeHandler={() => setShowProfile(false)} />
      ) : null}
    </StyledNavigation>
  );
};

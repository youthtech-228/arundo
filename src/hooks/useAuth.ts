import { useAuth0 } from '@auth0/auth0-react';
import { Auth0User } from '~/classes/Auth0User';

export const useAuth = () => {
  const hook = useAuth0<Auth0User>();

  return {
    ...hook,
    user: new Auth0User(hook.user),
  };
};

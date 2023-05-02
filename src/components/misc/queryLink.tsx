import { Link, LinkProps } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import { QueryParams, useQuery } from '~/contexts/queryContext';

/*
Examples:
<QueryLink location="13" replaceAll>
*/

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

interface QueryLinkProps
  extends React.PropsWithoutRef<LinkProps>,
    React.RefAttributes<HTMLAnchorElement> {
  query?: QueryParams;
  active?: string;
  isActive?: boolean;
  whenActive?: unknown;
}
export const QueryLink = ({
  children,
  query = {},
  active = 'full',
  isActive = false,
  whenActive = {
    style: {
      fontWeight: 'bold',
    },
  },
  to,
  replace,
  color,
  style,
  ...props
}: QueryLinkProps) => {
  delete (props as { return: unknown }).return; // HACK to prevent bug... track this down
  const { getPath } = useQuery();
  const oldPath = getPath();
  const newPath = getPath(query, to?.toString());
  let activeClass = {};

  if ((active === 'full' && oldPath === newPath) || isActive) {
    activeClass = whenActive;
  }

  return (
    <StyledLink to={newPath} style={style} {...activeClass} {...props}>
      {children}
    </StyledLink>
  );
};

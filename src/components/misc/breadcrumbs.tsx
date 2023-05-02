import React from 'react';
import styled from 'styled-components';
import { QueryLink } from './queryLink';

const StyledBreadcrumbs = styled.div`
  font-size: 1.1rem;
  align-self: flex-start;
  flex: 1;
  margin-left: 0 !important;
  font-weight: 400;

  > *:not(:first-child):before {
    content: '/';
    color: black;
    margin: 0 0.5em;
    display: inline-block;
    text-decoration: none;
  }

  a {
    white-space: nowrap;
    display: inline-block;
  }

  span {
    opacity: 0.8;
  }
`;

export const Breadcrumbs = ({ assetType, formOpen }) => {
  if (!assetType) {
    return null;
  }

  let cursor = assetType;
  const paths = [];

  while (cursor.parent) {
    paths.unshift((cursor = cursor.parent));
  }

  return (
    <StyledBreadcrumbs>
      {paths.map((assetType, i) =>
        formOpen ? (
          <span key={i}>{assetType.name} </span>
        ) : (
          <QueryLink key={i} to={assetType.url}>
            {assetType.name}
          </QueryLink>
        )
      )}
      <span>{assetType.name}</span>
    </StyledBreadcrumbs>
  );
};

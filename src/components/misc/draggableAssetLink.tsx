import React from 'react';
import styled from 'styled-components';
import { QueryLink } from './queryLink';
import { AssetType } from '~/classes/assetType';

const StyledLink = styled(QueryLink)<{
  custom?: string;
  return?: boolean;
}>`
  padding: 0.3em 0.2em 0.2em 0.4em;
  text-decoration: none;
  font-size: 1em;
  color: #eee;
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    text-decoration: none;
  }

  ${(props) => props.custom}

  ${(props) =>
    props.return
      ? `
      font-size: 1.5em;
    `
      : ''}
`;

interface Props {
  assetType: AssetType;
}

export const DraggableAssetLink = React.memo<Props>(
  ({ assetType, children }) => {
    return (
      <StyledLink
        draggable="true"
        onDragStart={(e) => e.dataTransfer.setData('assetId', assetType.id)}
        to={assetType.url}
        whenActive={{
          style: {
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: '#fb7e23',
          },
        }}
      >
        <span>{children || assetType.name}</span>
      </StyledLink>
    );
  }
);

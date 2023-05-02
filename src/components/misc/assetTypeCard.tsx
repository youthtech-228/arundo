import React from 'react';
import styled from 'styled-components';
import { TimelineIcon, BlockIcon } from '~/components/misc/icons';
import { Card, CardProps } from './card';
import { QueryLink } from './queryLink';
import { AssetType } from '~/classes/assetType';

const Type = styled.div`
  color: #000000;
  font-size: 1.2em;
  font-weight: 400;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 0.1em;
`;
const Timeseris = styled.div`
  display: inline-flex;
  vertical-align: center;
  color: #000000;
  font-size: 13px;
  font-weight: 300;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 10px;
  justify-content: space-between;
`;

const TimeSerisText = styled.span`
  margin-left: 5px;
`;
interface AssetTypeCardProps extends CardProps {
  assetType: AssetType;
}

export const AssetTypeCard = ({ assetType, ...props }: AssetTypeCardProps) => {
  const { name } = assetType;

  return (
    <Card as={QueryLink} to={assetType.url} {...props}>
      <Type>{name}</Type>
      <Timeseris>
        {assetType?.assetViewId ? <TimelineIcon /> : <BlockIcon />}

        {assetType?.assetViewId ? (
          <TimeSerisText> Data visible on charts</TimeSerisText>
        ) : (
          <TimeSerisText> Data hidden from charts</TimeSerisText>
        )}
      </Timeseris>
    </Card>
  );
};

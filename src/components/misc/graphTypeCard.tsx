import React from 'react';
import styled from 'styled-components';
import { Card, CardProps } from './card';
import { GraphType } from '~/classes/graphType';

const Type = styled.div`
  color: #000000;
  font-size: 1.2em;
  font-weight: 400;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 0.1em;
  min-height: 4em;
  cursor: pointer;
`;

interface GraphTypeCardProps extends CardProps {
  graphType: GraphType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const GraphTypeCard = ({ graphType, onClick, ...props }: GraphTypeCardProps) => {
  const { name } = graphType;

  return (
    <Card {...props} onClick={() => onClick(graphType)}>
      <Type>{name}</Type>
    </Card>
  );
};

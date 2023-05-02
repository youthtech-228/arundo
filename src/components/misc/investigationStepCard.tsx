import React from 'react';
import styled from 'styled-components';
import { Card, CardProps } from './card';
import { InvestigationStep } from '~/types/investigations';
import { ClosableUserIcon } from '~/components/misc/icons';

const Type = styled.div`
  color: #000000;
  font-size: 1em;
  font-weight: 400;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 0.3em;
`;
const Description = styled.div`
  color: #000000;
  font-size: 0.8em;
  font-weight: 200;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 0.2em;
  height: 2.8em;
  white-space: nowrap;
`;

const CardWithWidth = styled(Card)`
  width: 14em;
  margin-bottom: 0.8em;
  margin-right: 0.6em;
`;

const ClosableUser = styled.div`
  display: inline-flex;
  vertical-align: center;
  color: #000000;
  font-size: 0.8em;
  font-weight: 100;
  text-overflow: ellipsis;
  overflow: hidden;
  justify-content: space-between;
`;

const ClosableUserText = styled.span`
  margin-left: 0.1em;
`;

interface InvestigationStepCardProps extends CardProps {
  investigationStep: InvestigationStep;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const InvestigationStepCard = ({
  investigationStep,
  onClick,
}: InvestigationStepCardProps) => {
  const { title, description, canCloseInvestigation } = investigationStep;

  return (
    <CardWithWidth onClick={onClick}>
      <Type>{title != '' ? title : 'Step'}</Type>
      <Description>
        {description != '' ? description : 'Description...'}
      </Description>
      <ClosableUser>
        {canCloseInvestigation ? <ClosableUserIcon /> : <></>}
        {canCloseInvestigation ? (
          <ClosableUserText> Close investigation enabled </ClosableUserText>
        ) : (
          <></>
        )}
      </ClosableUser>
    </CardWithWidth>
  );
};

import React from 'react';
import styled from 'styled-components';
import { InvestigationStepCard } from '~/components/misc/investigationStepCard';
import { InvestigationPhase } from '~/types/investigations';
import { IconButton } from '@arundo/marathon-shared';
import { PlusIcon } from '~/components/misc/icons';

const PhaseContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StepAddButton = styled(IconButton)`
  margin-left: 0.6em;
`;

interface InvestigationStepCardProps {
  investigationPhase: InvestigationPhase;
  setStepFormOpen: (edit: boolean) => void;
  setSelectedStep: (step) => void;
  setSelectedPhase: (step) => void;
  phaseId: number;
}

export const InvestigationPhaseContainer = ({
  investigationPhase,
  phaseId,
  setSelectedStep,
  setSelectedPhase,
  setStepFormOpen,
}: InvestigationStepCardProps) => {
  return (
    <PhaseContainer>
      {investigationPhase?.steps?.map((step, index) => (
        <InvestigationStepCard
          key={index}
          investigationStep={step}
          onClick={() => {
            setSelectedStep(step);
            setSelectedPhase(phaseId);
            setStepFormOpen(true);
          }}
        />
      ))}
      <StepAddButton
        icon={PlusIcon}
        onClick={() => {
          setSelectedPhase(phaseId);
          setStepFormOpen(true);
        }}
      >
        {'Add Step'}
      </StepAddButton>
    </PhaseContainer>
  );
};

import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { FormWrapper } from '~/components/misc/formWrapper';
import { useMarathon } from '~/contexts/marathonContext';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@arundo/marathon-shared';
import { PlusIcon } from '~/components/misc/icons';
import { InvestigationPhaseContainer } from './investigationPhase';
import { StepForm } from './stepForm';

const useStyles = makeStyles(() => ({
  inputLabel: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '1em',
  },
}));

export const EditInvestigationType = ({ investigationType, setEditOpen }) => {
  const {
    api: { getInvestigationApi },
    marathon,
  } = useMarathon();

  const classes = useStyles();
  const [name, setName] = useState(investigationType?.name ?? '');
  const [phases, setPhases] = useState(investigationType?.phases);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [stepFormOpen, setStepFormOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { update } = getInvestigationApi();
    setLoading(true);

    const postData = {
      assetType: investigationType?.assetType ?? null,
      assetTypeId: investigationType?.assetTypeId ?? '',
      description: investigationType?.description ?? '',
      eventTypes: investigationType?.eventTypes,
      id: investigationType?.id ?? '',
      name: name,
      phases: phases,
      triggerUri: investigationType?.triggerUri,
    };

    await update(investigationType?.id, postData);
    window.location.reload();
    // success('successfully created !');
    marathon.refresh();
    setEditOpen(false);
  };

  const handleAddStep = (step, isEditing) => {
    if (isEditing) {
      const stepIndex = phases[selectedPhase].steps.findIndex((s) => {
        return s.id === step?.id;
      });

      setPhases([
        ...phases.slice(0, selectedPhase),
        {
          ...phases[selectedPhase],
          steps: [
            ...phases[selectedPhase].steps.slice(0, stepIndex),
            step,
            ...phases[selectedPhase].steps.slice(stepIndex + 1),
          ],
        },
        ...phases.slice(selectedPhase + 1),
      ]);
    } else {
      setPhases([
        ...phases.slice(0, selectedPhase),
        {
          ...phases[selectedPhase],
          steps: [...phases[selectedPhase].steps, step],
        },
        ...phases.slice(selectedPhase + 1),
      ]);
    }
  };

  const onCancel = () => {
    setEditOpen(false);
  };

  return !stepFormOpen ? (
    <FormWrapper
      title={'Edit Investigation'}
      saveButtonName={'Save'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={error?.name ? true : false}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError({ ...error, name: '' });
            }}
            label="Name"
            helperText={error?.name}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <InputLabel className={classes.inputLabel}>
            Resolution Steps
          </InputLabel>
          {phases?.length > 0 &&
            phases.map((phase, index) => (
              <InvestigationPhaseContainer
                key={index}
                setStepFormOpen={setStepFormOpen}
                setSelectedStep={setSelectedStep}
                setSelectedPhase={setSelectedPhase}
                investigationPhase={phase}
                phaseId={index}
              />
            ))}
          <IconButton
            icon={PlusIcon}
            onClick={() => {
              setPhases([
                ...phases,
                {
                  steps: [
                    {
                      title: '',
                      description: '',
                      id: window.crypto.randomUUID(),
                      canCloseInvestigation: false,
                      instructions: [
                        {
                          id: window.crypto.randomUUID(),
                          imageUri: '',
                          imageId: '00000000-0000-0000-0000-000000000000',
                          text: '',
                          html: '',
                        },
                      ],
                    },
                  ],
                },
              ]);
            }}
          >
            {'Add Phase'}
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={12}>
          <InputLabel>Close Investigation</InputLabel>
        </Grid>
      </Grid>
    </FormWrapper>
  ) : (
    <StepForm
      step={selectedStep}
      setSelectedStep={setSelectedStep}
      setFormOpen={setStepFormOpen}
      handleAddStep={handleAddStep}
    />
  );
};

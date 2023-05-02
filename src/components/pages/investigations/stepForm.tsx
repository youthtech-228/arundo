import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { FormWrapper } from '~/components/misc/formWrapper';
import styled from 'styled-components';
import { useMarathon } from '~/contexts/marathonContext';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@arundo/marathon-shared';
import { PlusIcon } from '~/components/misc/icons';
import { SwitchForCloseInvestigation } from '~/components/misc/switchButton';
import { RichTextEditor } from '~/components/misc/richText';

const AddButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const InstructionNumber = styled.span`
  font-weight: bold;
`;

const useStyles = makeStyles(() => ({
  inputLabel: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '1em',
  },
}));

export const StepForm = ({
  step,
  handleAddStep,
  setFormOpen,
  setSelectedStep,
}) => {
  const {
    api: { getImageApi },
  } = useMarathon();

  const { upload } = getImageApi();
  const classes = useStyles();
  const [name, setName] = useState(step?.title ?? '');
  const [description, setDescription] = useState(step?.description ?? '');
  const [canCloseInvestigation, setCanCloseInvestigation] = useState(
    step?.canCloseInvestigation ?? false
  );
  const [instructions, setInstructions] = useState([]);
  const [selectedInstruction, setInstruction] = useState(null);

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const stateRef = useRef();
  stateRef.current = instructions;

  useEffect(() => {
    setLoading(true);
    const htmlInstructions = step?.instructions.map((instruction) => {
      if (
        instruction.imageId !== '00000000-0000-0000-0000-000000000000' &&
        instruction.imageId !== 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      )
        instruction.html =
          '<p>' +
          instruction.text +
          "<img src='" +
          instruction.imageUri +
          "'/></p>";
      else instruction.html = '<p>' + instruction.text + "<img src=''/></p>";
      return instruction;
    });
    setLoading(false);
    setInstructions(htmlInstructions ?? []);
  }, []);

  const imageHandler = (instruction) => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file: Blob = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await upload(formData, 'test');
      if (res.uri) {
        setInstruction({
          id: instruction.id,
          text: instruction.text,
          imageUri: res.uri,
          imageId: res.id,
          html: instruction.html,
        });

        const instructionIndex = stateRef.current.findIndex((s) => {
          return s.id === instruction?.id;
        });

        setInstructions([
          ...stateRef.current.slice(0, instructionIndex),
          {
            ...stateRef.current[instructionIndex],
            imageUri: res.uri,
            imageId: res.id,
            html:
              '<p>' +
              stateRef.current[instructionIndex]?.text +
              "<img src='" +
              res.uri +
              "'/></p>",
          },
          ...stateRef.current.slice(instructionIndex + 1),
        ]);
      } else {
        console.log('err', res);
      }
    };
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (formValidation()) {
      const newStep = {
        canAssignToSiblings: false,
        canCloseInvestigation: canCloseInvestigation,
        description: description,
        title: name,
        instructions: instructions,
        id: step ? step?.id : window.crypto.randomUUID(),
      };
      handleAddStep(newStep, step ? true : false);
      setFormOpen(false);
      setSelectedStep(null);
    }
  };

  const onChangeInstruction = (content, delta, source, editor) => {
    if (source == 'user') {
      const instructionIndex = instructions.findIndex((s) => {
        return s.id === selectedInstruction?.id;
      });

      const regex = /<img.*?src=['"](.*?)['"]/;

      setInstructions([
        ...instructions.slice(0, instructionIndex),
        {
          ...instructions[instructionIndex],
          imageUri:
            regex.exec(content)?.length > 0 ? regex.exec(content)[1] : '',
          imageId:
            regex.exec(content)?.length > 0
              ? selectedInstruction?.imageId
              : '00000000-0000-0000-0000-000000000000',
          text: editor.getText(),
          html: content,
        },
        ...instructions.slice(instructionIndex + 1),
      ]);
    }
  };

  const formValidation = () => {
    let formValid = true;
    const errors = {};
    if (name === '') {
      formValid = false;
      errors['name'] = 'required';
    }
    setError(errors);
    return formValid;
  };

  const onCancel = () => {
    setFormOpen(false);
    setSelectedStep(null);
  };

  return (
    <FormWrapper
      title={step ? 'Edit Step' : 'Add Step'}
      saveButtonName={'Save'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12}>
              <InputLabel className={classes.inputLabel}>Name *</InputLabel>
              <TextField
                error={error?.name ? true : false}
                onChange={(e) => {
                  setName(e.target.value);
                  setError({ ...error, name: '' });
                }}
                value={name}
                placeholder="Step"
                helperText={error?.name}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel className={classes.inputLabel}>
                Description
              </InputLabel>
              <TextField
                id="standard-multiline-flexible"
                multiline
                minRows={6}
                value={description}
                variant="outlined"
                placeholder="Description..."
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError({ ...error, description: '' });
                }}
                helperText={error?.description}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel className={classes.inputLabel}>
                Ability to close investigation
              </InputLabel>
              <SwitchForCloseInvestigation
                onChange={() =>
                  setCanCloseInvestigation(!canCloseInvestigation)
                }
                checked={canCloseInvestigation}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel className={classes.inputLabel}>Instructions</InputLabel>
          {instructions?.map((instruction, index) => (
            <div key={index}>
              <InstructionNumber>{index + 1}</InstructionNumber>
              <RichTextEditor
                instruction={instruction}
                onChangeInstruction={onChangeInstruction}
                imageHandler={() => imageHandler(instruction)}
                setInstruction={setInstruction}
              />
            </div>
          ))}
          <AddButtonDiv>
            <IconButton
              icon={PlusIcon}
              onClick={() => {
                setInstructions([
                  ...instructions,
                  {
                    id: window.crypto.randomUUID(),
                    imageUri: '',
                    imageId: '00000000-0000-0000-0000-000000000000',
                    text: '',
                    html: '',
                  },
                ]);
              }}
            >
              {'Add'}
            </IconButton>
          </AddButtonDiv>
        </Grid>
      </Grid>
    </FormWrapper>
  );
};

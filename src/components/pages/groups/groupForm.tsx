import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { FormWrapper } from '~/components/misc/formWrapper';
import { MultipleSelect } from '~/components/misc/multiSelect';
import { Chip } from '~/components/misc/groupChip';
import { useMarathon } from '~/contexts/marathonContext';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@arundo/marathon-shared';
import { LockIcon, LockedIcon } from '~/components/misc/icons';
import { FormChangeDiv } from '~/components/misc/formChangeDiv';
import { success } from '~/services/messages';

const useStyles = makeStyles(() => ({
  inputLabel: {
    color: 'black',
    fontWeight: 'bold',
  },
  groupLabel: {
    color: 'black',
    marginBottom: '40px',
  },
}));

const LockButton = styled(IconButton)`
  margin-left: 15px;
`;

export const GroupForm = ({ group, edit, setFormOpen, setSelectedGroup }) => {
  const {
    users,
    api: { getGroupApi },
    marathon,
  } = useMarathon();

  const classes = useStyles();
  const [name, setName] = useState(edit ? group?.name : '');
  const [description, setDescription] = useState(
    edit ? group?.description : ''
  );
  const [groupUsers, setGroupUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [numberOfChanged, setNumberOfChanged] = useState(0);
  const [lock, setLock] = useState(true);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userIds = group?.users?.map((item) => item?.email) || [];
    const groupUsersArray = users.filter((user) =>
      userIds.includes(user.email)
    );
    setGroupUsers(groupUsersArray);
    setOriginalUsers(groupUsersArray);
  }, []);

  useEffect(() => {
    if (edit) {
      let tempNumber = 0;
      if (name != group?.name) tempNumber++;
      if (description != group?.description) tempNumber++;
      if (groupUsers != originalUsers) tempNumber++;
      setNumberOfChanged(tempNumber);
    }
  }, [name, description, groupUsers]);

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { create, update } = getGroupApi();
    setLoading(true);
    if (formValidation()) {
      const postGroup = {
        name: name,
        description: description,
        userIds: groupUsers.map((item) => item?.id),
      };

      if (!edit) {
        await create(postGroup, window.location.href);
      } else {
        await update(group?.id, postGroup);
        window.location.reload();
        success('successfully created !');
      }

      marathon.refresh();
      setFormOpen(false);
    }
  };

  const formValidation = () => {
    let formValid = true;
    const errors = {};
    if (name === '') {
      formValid = false;
      errors['name'] = 'required';
    }
    if (description === '') {
      formValid = false;
      errors['description'] = 'required';
    }
    setError(errors);
    return formValid;
  };

  const onCancel = () => {
    setSelectedGroup(null);
    setFormOpen(false);
  };

  const deleteGroup = (selectedGroup) => {
    const newGroups = groupUsers?.filter(
      (item) => item?.id != selectedGroup?.id
    );
    setGroupUsers(newGroups);
  };

  return (
    <FormWrapper
      title={edit ? 'Edit Group' : 'Create Group'}
      saveButtonName={edit ? 'Save' : 'Create'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <Grid container spacing={6}>
        {edit && numberOfChanged > 0 ? (
          <FormChangeDiv text={numberOfChanged + ' fields have been edited. Save to update.'} />
        ) : (
          <></>
        )}
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
        <Grid item xs={12} sm={6}>
          <TextField
            error={error?.description ? true : false}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError({ ...error, description: '' });
            }}
            label="Description"
            required
            fullWidth
            helperText={error?.description}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <InputLabel className={classes.inputLabel}>
            Users
            {edit ? (
              lock ? (
                <LockButton
                  icon={LockIcon}
                  onClick={() => setLock(false)}
                ></LockButton>
              ) : (
                <LockButton
                  icon={LockedIcon}
                  onClick={() => setLock(true)}
                ></LockButton>
              )
            ) : (
              <></>
            )}
          </InputLabel>
        </Grid>
        <Grid item xs={12} sm={6}>
          {groupUsers?.length > 0 ? (
            groupUsers?.map((item, index) => (
              <Chip
                key={index}
                lock={edit && lock}
                onDelete={() => deleteGroup(item)}
              >
                {' '}
                {item?.email}
              </Chip>
            ))
          ) : (
            <InputLabel>No user in this group yet.</InputLabel>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel className={classes.groupLabel}>Add Users</InputLabel>
          <MultipleSelect
            lock={edit && lock}
            options={users}
            optionName="email"
            selectedOption={groupUsers}
            handleChange={(e, value) => setGroupUsers(value)}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  );
};

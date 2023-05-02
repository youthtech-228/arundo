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
import { error, success } from '~/services/messages';

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

export const UserForm = ({ user, edit, setFormOpen, setSelectedUser }) => {
  const {
    groups,
    users,
    api: { getUserApi },
    marathon,
  } = useMarathon();

  const classes = useStyles();
  const [firstName, setFirstName] = useState(edit ? user?.firstName : '');
  const [lastName, setLastName] = useState(edit ? user?.lastName : '');
  const [email, setEmail] = useState(edit ? user?.email : '');
  const [numberOfChanged, setNumberOfChanged] = useState(0);
  const [group, setGroup] = useState(edit ? user?.groups : [groups?.find(group => group?.name === 'Users')]);
  const [lock, setLock] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit) {
      let tempNumber = 0;
      if (firstName != user?.firstName) tempNumber++;
      if (lastName != user?.lastName) tempNumber++;
      if (email != user?.email) tempNumber++;
      if (group != user?.groups) tempNumber++;
      setNumberOfChanged(tempNumber);
    }
  }, [firstName, lastName, email, group]);

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { create, update } = getUserApi();
    setLoading(true);
    if (formValidation()) {
      const postUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        isFederated: false,
        groupIds: group.map((item) => item?.id),
        productScopeId: '76d89d3a-b6a7-4a80-a3bb-6adb3c28ddc4',
        phoneNumber: null,
      };
      if (!edit) {
        const response = await create(postUser);
        if (response && response.status == 'Active') {
          error(
            response?.detail ? response?.detail : 'Oops. Something went wrong.'
          );
        } else {
          marathon.users.add(response);
          success('successfully created !');
        }
      } else {
        await update(user?.id, postUser);
        user?.updateUser(firstName, lastName, group, postUser.groupIds);
        success('successfully updated !');
      }
      setLoading(false);
      marathon.refresh();
      setFormOpen(false);
    }
  };

  const formValidation = () => {
    let formValid = true;
    const errors = {};
    if (firstName === '') {
      formValid = false;
      errors['firstName'] = 'required';
    }
    if (lastName === '') {
      formValid = false;
      errors['lastName'] = 'required';
    }
    if (typeof email !== 'undefined') {
      const lastAtPos = email.lastIndexOf('@');
      const lastDotPos = email.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          email.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          email.length - lastDotPos > 2
        )
      ) {
        formValid = false;
        errors['email'] = 'email is not valid';
      }
    }
    setErrors(errors);
    return formValid;
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const matchedUsers = users.filter(
      (user) => user?.email?.toLowerCase() === e.target?.value?.toLowerCase()
    );
    if (matchedUsers?.length > 0) {
      setErrors({
        ...error,
        email:
          'A user with this email is already activated. Please use another email address.',
      });
    } else {
      setErrors({ ...error, email: '' });
    }
  };

  const onCancel = () => {
    setSelectedUser(null);
    setFormOpen(false);
  };

  const onChangeStatus = async () => {
    const { update } = getUserApi();
    let status = 'Active';
    if (user?.status === 'Active') {
      status = 'Inactive';
    } else if (user?.status === 'Inactive') {
      status = 'Active';
    }

    const postUser = {
      status: status,
      lastInvitedDate: status === 'Active' ? new Date() : user?.lastInvitedDate,
    };

    await update(user?.id, postUser);
    user?.setStatus(status);
    marathon.refresh();
  }

  const deleteGroup = (selectedGroup) => {
    const newGroups = group?.filter((item) => item?.id != selectedGroup?.id);
    setGroup(newGroups);
  };
  return (
    <FormWrapper
      title={edit ? 'Edit User' : 'Invite User'}
      saveButtonName={edit ? 'Save' : 'Invite'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onChangeStatus={onChangeStatus}
      loading={loading}
      statusButton={edit ? user?.status === 'Active' ? true : false : null}
    >
      <Grid container spacing={6}>
        {edit && numberOfChanged > 0 ? (
          <FormChangeDiv numberOfChanged={numberOfChanged} />
        ) : (
          <></>
        )}
        <Grid item xs={12} sm={12}>
          <InputLabel className={classes.inputLabel}>User</InputLabel>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={errors?.firstName ? true : false}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors({ ...error, firstName: '' });
            }}
            label="First Name"
            helperText={errors?.firstName}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={errors?.lastName ? true : false}
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors({ ...error, lastName: '' });
            }}
            label="Last Name"
            required
            fullWidth
            helperText={errors?.lastName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={errors?.email ? true : false}
            value={email}
            onChange={(e) => {
              !edit ? onEmailChange(e) : null;
              setErrors({ ...error, email: '' });
            }}
            disabled={edit}
            label="Email"
            required
            fullWidth
            helperText={errors?.email ? errors?.email : ''}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <InputLabel className={classes.inputLabel}>
            Groups
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
          {group?.length > 0 ? (
            group?.map((item, index) => (
              <Chip
                key={index}
                lock={edit && lock}
                onDelete={() => deleteGroup(item)}
              >
                {' '}
                {item?.name}
              </Chip>
            ))
          ) : (
            <InputLabel>User not in any group yet.</InputLabel>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel className={classes.groupLabel}>Add to group</InputLabel>
          <MultipleSelect
            lock={edit && lock}
            options={groups}
            selectedOption={group}
            handleChange={(e, value) => setGroup(value)}
          />
        </Grid>
      </Grid>
    </FormWrapper>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { Button, StatusChangeButton } from './button';
import { LoadingSpinner } from '@arundo/marathon-shared';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

const LoadingDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const useStyles = makeStyles(() => ({
  card: {
    boxShadow: 'none',
  },
  header: {
    paddingLeft: '0em',
    marginRight: '2em',
  },
  button: {
    marginTop: '1.5em',
    marginRight: '1.5em',
    width: '10em',
    justifyContent: 'center',
  },
}));

interface Props {
  title?: string;
  saveDisabled?: boolean;
  saveButtonName?: string;
  onSubmit: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCancel: () => void;
  onChangeStatus?: () => void;
  children: any;
  loading: boolean;
  statusButton?: boolean;  
}

export function FormWrapper({
  title = '',
  saveDisabled = false,
  saveButtonName = '',
  onSubmit,
  onCancel,
  onChangeStatus,
  children,
  loading = false,
  statusButton = null
}:Props) {
  const classes = useStyles();
  const actionArray = [
    <Button
      onClick={onCancel}
      key="cancelButton"
      whiteBg
      cancel
      className={classes.button}
    >
      Cancel
    </Button>,
    <Button
      onClick={onSubmit}
      disabled={saveDisabled}
      key="saveButton"
      className={classes.button}
    >
      {loading ? (
        <LoadingDiv>
          <LoadingSpinner /> saving
        </LoadingDiv>
      ) : (
        saveButtonName
      )}
    </Button>
  ];

  if( statusButton != null ) {
    actionArray.unshift(
      <StatusChangeButton
        onClick={onChangeStatus}
        key="statusButton"
        activate={statusButton}
        cancel
        className={classes.button}
      >
        {statusButton ? 'DeActivate' : 'Activate'}
      </StatusChangeButton>   
    )
  };

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title={title}
          component={Typography}
          variant="h6"
          disableTypography
          action={actionArray}
        />
        <CardContent>
          <Typography variant="h6" />
          {children}
        </CardContent>
      </Card>
    </>
  );
}

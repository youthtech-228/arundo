import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(() => ({
  formControl: {
    padding: 0,
    margin: 0,
    width: '100%',
  },
}));

export function FormControlCustom({ children }) {
  const classes = useStyles();

  return <FormControl className={classes.formControl}>{children}</FormControl>;
}

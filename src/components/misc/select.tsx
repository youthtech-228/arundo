import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { SeverityIcon } from '~/components/misc/icons';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      width: '100%',
    },
  })
);

const Severities = {
  '1': {
    color: '#FBCF21',
    label: 'Low',
  },
  '2': {
    color: '#FB7E23',
    label: 'Warning',
  },
  '3': {
    color: '#FF0000',
    label: 'High',
  },
};

const usePlaceholderStyles = makeStyles(theme => ({
  placeholder: {
    color: "#aaa"
  }
}));

const Placeholder = ({ children }) => {
  const classes = usePlaceholderStyles();
  return <div className={classes.placeholder}>{children}</div>;
};

export const SelectInput = ({
  handleChange,
  value,
  options,
  valueField = '',
  nameField = '',
  multiple = false,
  object = false,
  required = false,
  error = false,
  placeholder = ''
}) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="dynamic-select"
        id="dynamic-select"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        multiple={multiple}
        required={required}
        displayEmpty
        error={error}
        renderValue={
          value !== "" ? undefined : () => <Placeholder>{placeholder}</Placeholder>
        }
      >
        {options?.map((row, index) => (
          <MenuItem key={index} value={object ? row[valueField] : row}>
            {object ? row[nameField] : row}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};


export const SeveritySelectInput = ({
  handleChange,
  value,
  options,
  valueField = '',
  multiple = false,
  object = false,
  required = false,
  error = false,
}) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="dynamic-select"
        id="dynamic-select"
        value={value}
        onChange={handleChange}
        multiple={multiple}
        required={required}
        error={error}
      >
        {options?.map((row, index) => (
          <MenuItem key={index} value={object ? row[valueField] : row}>
            <span>
              <SeverityIcon color={Severities[row?.name].color} /> {Severities[row?.name].label}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
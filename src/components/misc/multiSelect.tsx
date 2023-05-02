import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
  })
);

interface Props {
  lock: boolean;
  options: unknown[];
  selectedOption: unknown[];
  optionName?: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, value) => null;
}

export const MultipleSelect = ({
  lock = false,
  options = [],
  selectedOption = [],
  optionName = 'name',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleChange = (event: React.ChangeEvent<HTMLInputElement>, value) => null,
}: Props) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <Autocomplete
        id="tags-standard"
        value={selectedOption}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option[optionName]}
        onChange={handleChange}
        multiple
        disableCloseOnSelect
        getOptionDisabled={() => {
          return lock ? true : false;
        }}
        options={options}
        ListboxProps={{ style: { maxHeight: '12rem' } }}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              style={{
                marginRight: 8,
                color: '#FB7E23',
              }}
            />
            <li>{option[optionName]}</li>
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={lock ? 'Unlock to search' : 'Search'}
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

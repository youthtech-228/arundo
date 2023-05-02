import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  TimelineIcon,
  BlockIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  ClosableInvestigationIcon,
} from '~/components/misc/icons';
import styled from 'styled-components';

const StyledSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 38,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(20px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: '#52d869',
          borderColor: '#52d869',
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
      borderColor: theme.palette.grey[500],
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  })
)(Switch);

const StyledControlLabel = withStyles(() =>
  createStyles({
    root: {
      width: 130,
      paddingTop: 20,
      paddingLeft: 10,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 16,
    },
  })
)(FormControlLabel);

const Timeseris = styled.div`
  width: 70px;
  display: flex;
  vertical-align: center;
  color: #000000;
  font-size: 14px;
  font-weight: 300;
  justify-content: space-between;
  margin-top: 2px;
`;

export default function Switches({
  checked = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => null,
  ...props
}) {
  return (
    <StyledControlLabel
      control={
        <StyledSwitch
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChange(event);
          }}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          {...props}
        />
      }
      label={
        checked ? (
          <Timeseris>
            <TimelineIcon /> Visible
          </Timeseris>
        ) : (
          <Timeseris>
            <BlockIcon /> Hidden
          </Timeseris>
        )
      }
    />
  );
}

export function SwitchForCloseInvestigation({
  checked = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => null,
  ...props
}) {
  return (
    <StyledControlLabel
      control={
        <StyledSwitch
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChange(event);
          }}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          {...props}
        />
      }
      label={
        checked ? (
          <Timeseris>
            <ClosableInvestigationIcon /> Enabled
          </Timeseris>
        ) : (
          <Timeseris>Disabled</Timeseris>
        )
      }
    />
  );
}

export function SwitchForVisibility({
  checked = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => null,
  ...props
}) {
  return (
    <StyledControlLabel
      control={
        <StyledSwitch
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChange(event);
          }}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          {...props}
        />
      }
      label={
        checked ? (
          <Timeseris>
            <VisibilityIcon /> Visiable
          </Timeseris>
        ) : (
          <Timeseris>
            <VisibilityOffIcon /> Hidden
          </Timeseris>
        )
      }
    />
  );
}

import React from 'react';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width:'300px',
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      width: '400px',
      backgroundColor: theme.palette.background.paper,
    },
    poper: {
      overflowY: 'hidden',
    },
  })
);

const StyledGroup = styled.div`
  display: inline-flex;
`;

const StyledSpan = styled.span`
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: var(--accent-hover);
  }
`;

const StyledChip = styled.div`
  color: rgba(0, 0, 0, 0.87);
  border: solid 1px gray;
  cursor: default;
  height: 32px;
  display: inline-flex;
  outline: 0;
  padding: 0;
  font-size: 0.8125rem;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  align-items: center;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  white-space: nowrap;
  border-radius: 16px;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;
  background-color: white;
  padding: 0 1em 0 1em;
  font-weight: 400;
  margin-right: 10px;
  margin-bottom: 10px;

  svg {
    fill: rgb(166, 166, 166);
    margin-left: 0.3em;
    cursor: pointer;

    &:hover {
      fill: rgb(99, 99, 99);
    }
  }
`;

const CloseButton = (props: { onClick: () => void }) => (
  <svg
    className="MuiSvgIcon-root MuiChip-deleteIcon"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="presentation"
    {...props}
  >
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
  </svg>
);

// MISSING
export const Chip = ({ children, onDelete, lock, ...props }) => (
  <StyledChip {...props}>
    <div>{children}</div>
    {!lock ? <CloseButton onClick={onDelete} /> : <></>}
  </StyledChip>
);

// MISSING
export const GroupChip = ({ children, ...props }) => (
  <StyledChip {...props}>
    <div>{children}</div>
  </StyledChip>
);

export const GroupChips = ({ groups }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <StyledGroup>
      {groups?.length < 3 ? (
        groups?.map((group, index) => (
          <GroupChip key={index}>{group?.name}</GroupChip>
        ))
      ) : (
        <div>
          <StyledGroup>
            <GroupChip>{groups[0]?.name}</GroupChip>
            <GroupChip>{groups[1]?.name}</GroupChip>
          </StyledGroup>
          <div>
            <StyledSpan onClick={handleClick}>
              {' '}
              {groups?.length - 2} more
            </StyledSpan>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              style={{ overflow: 'hidden' }}
            >
              <div className={classes.root}>
                  {groups?.map((group, index) => (
                    <GroupChip
                      key={index}
                    >
                      {group?.name}
                    </GroupChip>
                  ))}
              </div>
            </Popover>
          </div>
        </div>
      )}
    </StyledGroup>
  );
};






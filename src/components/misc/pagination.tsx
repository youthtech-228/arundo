import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingBottom: '30px',
      '& > *': {
        marginTop: theme.spacing(2),
      },
      '& .Mui-selected': {
        // backgroundColor: 'transparent',
        fontWeight: 'bold',
      },
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
);

interface Props {
  onPageChange: (page: number) => void;
  currentPage: number;
  pageCount: number;
}

export const Paginator = ({ pageCount, onPageChange, currentPage }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Pagination
        count={pageCount}
        onChange={(_, page) => onPageChange(page)}
        page={currentPage}
        className={classes.pagination}
      />
    </div>
  );
};

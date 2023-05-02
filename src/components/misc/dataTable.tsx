import React from 'react';
import styled from 'styled-components';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@arundo/marathon-shared';

const StyledDataTable = styled.div`
  .MuiPaper-root {
    background: #ffffff;
    box-shadow: none;
  }

  th {
    background: transparent;
    border-bottom: none;
    color: #0a234b !important;
    text-align: left;
  }

  div[class*='MTableToolbar-searchField'] {
    width: 30em;
    padding-left: 0;
  }

  .MuiToolbar-root {
    padding-left: 1.1em;
  }

  h6 {
    font-size: 1.8em;
    font-weight: 400;
  }

  table {
    border-spacing: 2px;
    border-collapse: inherit;
    width: 100%;
  }

  th,
  td {
    padding: 0.5rem 0.7rem;
    border-bottom: none;
  }

  th {
    font-size: 1.4em;
    font-weight: 400;
  }

  tbody tr {
    cursor: pointer;

    &:nth-child(odd) td {
      background-color: #eee;
    }

    & > td.actions {
      font-size: 2em;
      line-height: 0;
      width: 96px;
      padding: 0px 5px;
      box-sizing: content-box;

      line-height: 0;

      svg {
        box-sizing: content-box;
        font-size: 1.5rem;
        padding: 12px;
        border-radius: 50%;
      }
    }
    &:hover td {
      background-color: #ddd;

      &:nth-child(odd) td {
        background-color: #ccc;
      }
    }
  }
`;

interface RowButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const RowButton = ({ onClick, icon }: RowButtonProps) => (
  <IconButton
    icon={icon}
    hoverBackgroundColor="#00000011"
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
  ></IconButton>
);

const EmptyTable = ({ columns }) => (
  <StyledDataTable>
    <table>
      <thead>
        <tr>
          {columns.map(({ title }) => (
            <th key={title}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={columns.length}>No favorites to display</td>
        </tr>
      </tbody>
    </table>
  </StyledDataTable>
);

interface Props {
  columns;
  rows;
  onRowUpdate;
  onRowDelete;
  onRowClick;
  sortBy;
  sortDirection;
}
export const DataTable = ({
  columns,
  rows,
  onRowUpdate,
  onRowDelete,
  onRowClick,
  sortBy,
  sortDirection,
}: Props) => {
  const [actionContext, setActionContext] = React.useState<{
    index: number;
    status: string;
    data?: unknown;
  }>({
    index: -1,
    status: null,
    data: null,
  });
  // TODO: fix selectable sort
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sort, setSort] = React.useState({
    field: sortBy ?? columns?.[1]?.field,
    direction: sortDirection ?? 'desc',
  });
  const sortedRows = rows.sort((a, b) => a - b);

  const deletable = !!onRowDelete;
  const editable = !!onRowUpdate && columns.find((col) => !!col.editComponent);
  const showActions = deletable || editable;

  const renderCell =
    (isActive, row) =>
    ({ field, render: renderField, editComponent: Edit }) => {
      if (isActive && actionContext.status === 'editing' && Edit) {
        return (
          <td key={field}>
            <Edit
              value={actionContext.data[field]}
              onChange={(val) =>
                setActionContext({
                  ...actionContext,
                  data: {
                    ...(actionContext.data as []),
                    [field]: val,
                  },
                })
              }
            />
          </td>
        );
      }
      const value = renderField ? renderField(row) : row[field];
      return <td key={value}>{value}</td>;
    };

  const renderRowActions = (isActive, index, row) => (
    <td className="actions">
      {editable && !isActive && (
        <RowButton
          icon={EditIcon}
          onClick={() =>
            setActionContext({
              index,
              status: 'editing',
              data: row,
            })
          }
        />
      )}
      {deletable && !isActive && (
        <RowButton
          icon={DeleteIcon}
          onClick={(e) => {
            e.stopPropagation();
            setActionContext({
              index,
              status: 'deleting',
              data: row,
            });
          }}
        />
      )}
      {isActive && (
        <>
          <RowButton
            icon={DoneIcon}
            onClick={() => {
              switch (actionContext.status) {
                case 'deleting':
                  onRowDelete(row);
                  break;
                case 'editing':
                  onRowUpdate(actionContext.data, row);
                  break;
              }
              setActionContext({ index: -1, status: null });
            }}
          />
          <RowButton
            icon={CloseIcon}
            onClick={() => setActionContext({ index: -1, status: null })}
          />
        </>
      )}
    </td>
  );

  const renderRow = (row, index) => {
    const isActive = actionContext.index === index;

    return (
      <tr key={row.url} onClick={(e) => !isActive && onRowClick(e, row)}>
        {isActive && actionContext.status === 'deleting' ? (
          <td colSpan={columns.length}>
            Are you sure you want to delete this row?
          </td>
        ) : (
          columns.map(renderCell(isActive, row))
        )}
        {showActions && renderRowActions(isActive, index, row)}
      </tr>
    );
  };

  if (!sortedRows.length) {
    return <EmptyTable columns={columns} />;
  }

  return (
    <StyledDataTable>
      <table>
        <thead>
          <tr>
            {columns.map(({ title }) => {
              return <th key={title}>{title}</th>;
            })}
            {showActions && <th key="actions">Actions</th>}
          </tr>
        </thead>
        <tbody>{sortedRows.map(renderRow)}</tbody>
        <tfoot></tfoot>
      </table>
    </StyledDataTable>
  );
};

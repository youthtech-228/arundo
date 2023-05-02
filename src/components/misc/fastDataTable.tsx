import React, { MouseEvent as BaseMouseEvent, ReactNode } from 'react';
import { CellEditIcon, SortAscIcon, SortDescIcon, HelpIcon } from './icons';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@arundo/marathon-shared';
import styled from 'styled-components';

const StyledTable = styled.table<{ rowCursor?: boolean }>`
  text-align: left;
  border-collapse: collapse;
  overflow-y: scroll;
  th,
  td {
    padding: 0.6rem 1rem;
    line-height: 2em;
    &:empty {
      padding: 0;
    }
  }
  th {
    font-size: 1.1em;
    font-weight: 400;
    vertical-align: bottom;
  }

  tr {
    border-bottom: 1px solid #ddd;
    max-height: 30px;
  }

  tbody tr {
    cursor: ${(props) => (props.rowCursor ? 'pointer' : '')};
    &:hover td {
      background-color: #ddd;

      &:nth-child(odd) td {
        background-color: #ccc;
      }
    }
  }
`;

const HelpContainer = styled.div`
  margin-left: 5px;
`;

const TitleContanier = styled.div`
  display: flex;
  flex-direction: row;
`;

const CellInput = styled.input`
  border-left: none;
  border-top: none;
  border-right: none;
  &:focus {
    outline: none;
  }
  width: 60%;
  height: 30px;
  background: transparent;
`;

type MouseEvent = BaseMouseEvent<HTMLTableCellElement>;

interface TypeWithId {
  id?: string;
  styles?: string;
}

interface StyledCellProps {
  key?: string;
  styles?: string;
  onClick?: (e: MouseEvent) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
}

interface StyledRowProps {
  key?: string;
  styles?: string;
}

const StyledCell = styled.td<StyledCellProps>`
  ${(props) => props.styles}
`;

const StyledRow = styled.tr<StyledRowProps>`
  ${(props) => props?.styles}
`;

interface FastDataColumnProps<T extends TypeWithId> {
  onClick?: (e: MouseEvent, item: T) => void;
  render?: (item: T, value: unknown) => ReactNode;
  title?: string;
  getValue?: (item: T) => string;
  columnStyles?: string;
  sort?: string;
}

interface FastDataTableProps<T extends TypeWithId> {
  rowCursor?: boolean;
  columns: FastDataColumnProps<T>[];
  className?: string;
  items?: T[];
  limit?: number;
  editable?: boolean;
  sort?: string;
  highlighter?: (str: string) => string;
  onRowClick?: (e: MouseEvent, item: T) => void;
  onRowHover?: (e: MouseEvent, item: T) => void;
  onRowOut?: (e: MouseEvent, item: T) => void;
  onCellClick?: (e: MouseEvent, item: T) => void;
  onChangeSave?: (value: string, id: number, colName: string) => void;
  onChangeSort?: (column: string, sort: string) => void;
}

const helpText =
  'By checking the box, the latest value of the asset will appear in the event detail for events of this type.';

const FastDataTableHeader = <T extends TypeWithId>({
  columns,
  sort,
  onChangeSort,
}: FastDataTableProps<T>) => {
  return (
    <thead>
      <tr>
        {columns.map((c, i) => (
          <th key={i}>
            <TitleContanier>
              {c.title}
              {c.title === 'Latest Value' && (
                <Tooltip title={helpText} arrow>
                  <HelpContainer>
                    <HelpIcon />
                  </HelpContainer>
                </Tooltip>
              )}
            </TitleContanier>
            {sort ? (
              <IconButton
                icon={
                  c.title ? (sort == 'ASC' ? SortAscIcon : SortDescIcon) : ''
                }
                onClick={() => onChangeSort(c.sort, sort)}
              />
            ) : (
              <></>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const MemoizedFastDataTableHeader = React.memo(
  FastDataTableHeader
) as typeof FastDataTableHeader;

const EditableCell = React.memo((props) => {
  const [editable, setEditable] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(
    props?.valueWithoutHtml ?? ''
  );

  React.useEffect(
    () => setLocalValue(props?.valueWithoutHtml ?? ''),
    [props?.valueWithoutHtml]
  );

  if (editable) {
    const handleInputChange = (e) => setLocalValue(e.target.value);
    return (
      <div>
        <CellInput
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              props?.onChangeSave(localValue, props?.id, props?.colName);
              setEditable(false);
            }
          }}
        />
      </div>
    );
  }
  if (!editable) {
    const handleEditClick = () => {
      setEditable(true);
    };
    return (
      <div>
        <span dangerouslySetInnerHTML={{ __html: props.value }} />
        <IconButton icon={CellEditIcon} onClick={handleEditClick} />
      </div>
    );
  }
  return null;
});

const FastDataTableRows = <T extends TypeWithId>({
  columns = [],
  highlighter = undefined,
  items = [],
  editable = false,
  onCellClick = undefined,
  onRowHover = undefined,
  onRowOut = undefined,
  onRowClick = undefined,
  onChangeSave = undefined,
}: FastDataTableProps<T>) => {
  return (
    <tbody>
      {items.map((item, rowIndex) => (
        <StyledRow
          key={item.id ? item.id : rowIndex.toString()}
          styles={item?.styles}
        >
          {columns.map((column, columnIndex) => {
            let key = '';
            if (item?.id) {
              key = item.id + rowIndex + columnIndex;
            } else {
              key = '' + rowIndex + columnIndex;
            }
            const value = highlighter
              ? highlighter(column.getValue(item))
              : column.getValue(item);
            const valueWithoutHtml = column.getValue(item);
            const onClickHandler = column.onClick || onCellClick || onRowClick;
            const cellProps: StyledCellProps = { key };

            if (column.columnStyles) {
              cellProps.styles = column.columnStyles;
            }

            if (onClickHandler) {
              cellProps.onClick = (e: MouseEvent) => onClickHandler(e, item);
            }

            if (onRowHover) {
              cellProps.onMouseOver = (e: MouseEvent) => onRowHover(e, item);
            }
            if (onRowOut) {
              cellProps.onMouseLeave = (e: MouseEvent) => onRowOut(e, item);
            }

            return column.render ? (
              <StyledCell {...cellProps}>
                {column.render(item, value)}
              </StyledCell>
            ) : editable ? (
              <StyledCell {...cellProps}>
                <EditableCell
                  id={item?.id}
                  value={value}
                  valueWithoutHtml={valueWithoutHtml}
                  onChangeSave={onChangeSave}
                  colName={column?.title}
                />
              </StyledCell>
            ) : (
              <StyledCell
                {...cellProps}
                dangerouslySetInnerHTML={{ __html: value }}
              />
            );
          })}
        </StyledRow>
      ))}
    </tbody>
  );
};
const FastDataTableBase = <T extends TypeWithId>({
  rowCursor = true,
  columns = [],
  className,
  highlighter,
  editable = false,
  sort = '',
  items = [],
  limit = 100,
  onRowClick = undefined,
  onRowHover = undefined,
  onCellClick = undefined,
  onRowOut = undefined,
  onChangeSave = undefined,
  onChangeSort = undefined,
}: FastDataTableProps<T>) => {
  return (
    <StyledTable className={className} rowCursor={rowCursor}>
      <MemoizedFastDataTableHeader
        columns={columns}
        sort={sort}
        onChangeSort={onChangeSort}
      />
      <FastDataTableRows
        columns={columns}
        items={items.slice(0, limit)}
        highlighter={highlighter}
        onCellClick={onCellClick}
        editable={editable}
        onRowClick={onRowClick}
        onRowHover={onRowHover}
        onRowOut={onRowOut}
        onChangeSave={onChangeSave}
      />
    </StyledTable>
  );
};

export const FastDataTable = React.memo(
  FastDataTableBase
) as typeof FastDataTableBase;

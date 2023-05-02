import { useNavigate } from 'react-router';
import React from 'react';
import styled from 'styled-components';
import { AssetType } from '~/classes/AssetType';
import { MarathonItem } from '@arundo/marathon-shared';
import { ContentSection } from '~/components/Layout/contentSection';
import { Checkbox } from '@arundo/marathon-shared';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { useSelection } from '~/hooks/useSelection';
import { Paginator } from '~/components/misc/pagination';
import { TimelineIcon, BlockIcon } from '~/components/misc/icons';
import usePagination from '~/hooks/usePagination';

const CheckboxContainer = styled.div`
  .checkbox {
    padding: 0;
  }
`;

interface SelectionToggleProps {
  item: AssetType;
  selected: boolean;
  toggleSelected: (item: AssetType) => void;
}

const SelectionToggle = React.memo<SelectionToggleProps>(
  ({ item, selected, toggleSelected }) => {
    return (
      <CheckboxContainer>
        <Checkbox
          checked={selected}
          onChange={() => toggleSelected(item)}
          className="checkbox"
        />
      </CheckboxContainer>
    );
  }
);

SelectionToggle.displayName = 'SelectionToggle';

export interface ListProps<T extends MarathonItem> {
  highlighter: (str: string) => string;
  filteredItems: T[];
  limit?: number;
  onNavigate?: () => void;
}

type AssetTypesListProps = ListProps<AssetType>;

export const AssetTypesList = React.memo<AssetTypesListProps>(
  ({ highlighter = undefined, filteredItems = [], limit = 10, onNavigate }) => {
    const selectionHook = useSelection();
    const { isSelected, toggleSelected } = selectionHook;
    const navigate = useNavigate();

    const { current, currentPage, numberOfPages, jump } = usePagination(
      filteredItems,
      limit
    );
    return (
      <ContentSection fullwidth>
        <FastDataTable<AssetType>
          columns={[
            {
              getValue: (assetType) => assetType.id,
              // eslint-disable-next-line react/display-name
              render: (assetType) => (
                <SelectionToggle
                  item={assetType}
                  selected={isSelected(assetType)}
                  toggleSelected={toggleSelected}
                />
              ),
              onClick: (e) => e?.stopPropagation?.(),
              columnStyles: `
                width: 1rem;
              `,
            },
            {
              title: 'Name',
              getValue: (assetType) => assetType.path,
            },
            {
              title: 'Time Series',
              getValue: (assetType) => assetType.name,
              render: (assetType) =>
                assetType?.assetViewName === 'Simple Timeseries' ? (
                  <TimelineIcon />
                ) : (
                  <BlockIcon />
                ),
            },
            {
              title: 'Instances',
              getValue: (assetType) => assetType?.id,
              render: (assetType) => {
                const visiableInstances = assetType?.instances.filter(
                  (instance) => instance.isVerified === true
                );
                return (
                  assetType.instances?.length +
                  ' (' +
                  visiableInstances?.length +
                  ' visible)'
                );
              },
            },
          ]}
          items={current}
          highlighter={highlighter}
          limit={limit}
          onRowClick={(_, item) => {
            console.log('ASSETTYPE LIST CLICK', { onNavigate });
            onNavigate?.();
            navigate(item.url);
          }}
        />
        {numberOfPages > 1 ? (
          <Paginator
            onPageChange={jump}
            currentPage={currentPage}
            pageCount={numberOfPages}
          />
        ) : (
          <></>
        )}
      </ContentSection>
    );
  }
);

AssetTypesList.displayName = 'AssetTypesList';

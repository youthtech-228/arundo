import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Asset } from '~/classes/asset';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { Checkbox } from '@arundo/marathon-shared';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { VisibilityIcon, VisibilityOffIcon } from '~/components/misc/icons';
import { SearchInput } from '~/components/misc/searchInput';
import { useSelection } from '~/hooks/useSelection';
import { Paginator } from '~/components/misc/pagination';
import { MarathonItem } from '@arundo/marathon-shared';
import { useSearch } from '~/hooks/useSearch';
import { useMarathon } from '~/contexts/marathonContext';
import usePagination from '~/hooks/usePagination';
import { IconButton } from '@arundo/marathon-shared';

const CheckboxContainer = styled.div`
  .checkbox {
    padding: 0;
  }
`;

const ContentSection = styled(ContentSectionBase)`
  display: grid;
  padding: 0;
  margin-bottom: 70px;
  & > div:first-of-type {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }
`;

const SearchDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SelectAllCheckbox = styled(Checkbox)`
  padding: 0.6rem 1rem;
  line-height: 2.4em;
  overflow-x: hidden;
  overflow-y: hidden !important;
  min-height: 20px;
`;

const SplitPane = styled.div`
  grid-column: 1;
  display: flex;
  flex-flow: wrap;
  align-items: flex-start;
  align-content: center;
  justify-content: flex-end;

  > * {
    margin-left: 1em;
  }
`;

const ActionSpan = styled.div`
  display: flex;
`;

interface SelectionToggleProps {
  item: Asset;
  selected: boolean;
  toggleSelected: (item: Asset) => void;
}

const SelectionToggle = React.memo<SelectionToggleProps>(
  ({ item, selected, toggleSelected }) => {
    return (
      <CheckboxContainer>
        <Checkbox
          className="checkbox"
          checked={selected}
          onChange={() => toggleSelected(item)}
        />
      </CheckboxContainer>
    );
  }
);

SelectionToggle.displayName = 'SelectionToggle';

export interface ListProps<T extends MarathonItem> {
  filteredItems: T[];
  limit?: number;
}

type AssetsListProps = ListProps<Asset>;

export const AssetsList = React.memo<AssetsListProps>(
  ({ filteredItems = [], limit = 10 }) => {
    const [checkedAll, setCheckedAll] = useState(false);
    const selectionHook = useSelection();
    const { selection, isSelected, toggleSelected, setSelection } =
      selectionHook;

    useEffect(() => {
      setCheckedAll(false);
      setTerms('');
    }, [filteredItems]);

    const instanceCategory = 'instance';

    const searchHook = useSearch({
      items: filteredItems,
      namespace: instanceCategory,
      initial: {
        terms: '',
        tokens: [],
        config: {},
      },
    });

    const { highlighter, results, setTerms } = searchHook;

    useEffect(() => {
      if (selection?.length > 0 && selection?.length === results?.length) {
        setCheckedAll(true);
      } else {
        setCheckedAll(false);
      }
    }, [selection]);

    const {
      api: { getAssetApi },
      marathon,
    } = useMarathon();

    const { current, range, currentPage, numberOfPages, jump } = usePagination(
      results,
      limit
    );

    const updateAssetView = (isVerified) => {
      selection.map(async (asset) => {
        const { update } = getAssetApi(asset?.id);
        const postAsset = {
          notificationGroupId: asset?.notificationGroupId
            ? asset?.notificationGroupId
            : null,
          parentId: asset?.parentId ? asset?.parentId : null,
          tagId: asset?.tagId ? asset?.tagId : null,
          isVerified: isVerified,
        };

        await update(asset?.id, postAsset);
        asset?.setVerify(isVerified);
        marathon.refresh();
      });
      setSelection([]);
    };

    const allSelected = () => {
      setCheckedAll(!checkedAll);
      setSelection(results);
      if (checkedAll) {
        setSelection([]);
      }
    };

    return (
      <ContentSection fullwidth>
        <p>
          Showing {`${range.start}-${range.end} of`} {results.length} matching
          items
        </p>

        <br />
        <SearchDiv>
          <ActionSpan>
            <SelectAllCheckbox
              className="checkbox"
              label="Select all"
              checked={checkedAll}
              color={'black'}
              onChange={() => allSelected()}
            />
            {selection?.length > 0 ? (
              <SplitPane>
                <IconButton
                  icon={VisibilityIcon}
                  onClick={() => updateAssetView(true)}
                >
                  {'Show in Marathon'}
                </IconButton>
                <IconButton
                  icon={VisibilityOffIcon}
                  onClick={() => updateAssetView(false)}
                >
                  {'Hide in Marathon'}
                </IconButton>
              </SplitPane>
            ) : (
              <></>
            )}
          </ActionSpan>
          <SearchInput
            category={'Search for an instance'}
            searchHook={searchHook}
          />
        </SearchDiv>

        <FastDataTable<Asset>
          columns={[
            {
              title: 'Name',
              getValue: (asset) => asset.id,
              // eslint-disable-next-line react/display-name
              render: (asset) => (
                <SelectionToggle
                  item={asset}
                  selected={isSelected(asset)}
                  toggleSelected={toggleSelected}
                />
              ),
              onClick: (e) => e?.stopPropagation?.(),
              columnStyles: `
                width: 1rem;
              `,
            },
            {
              getValue: (asset) => asset?.path,
            },
            {
              title: 'Visibility in Marathon',
              getValue: (asset) => asset.name,
              render: (asset) =>
                asset?.isVerified ? <VisibilityIcon /> : <VisibilityOffIcon />,
            },
          ]}
          items={current}
          limit={limit}
          highlighter={highlighter}
          rowCursor={false}
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

AssetsList.displayName = 'AssetsList';

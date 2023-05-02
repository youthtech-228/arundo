import React, { useState } from 'react';
import styled from 'styled-components';
import { InvestigationType } from '~/classes/investigationType';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { PlusIcon } from '~/components/misc/icons';
import { SearchInput } from '~/components/misc/searchInput';
import { Paginator } from '~/components/misc/pagination';
import { MarathonItem } from '@arundo/marathon-shared';
import { useSearch } from '~/hooks/useSearch';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy, sortBy } from '~/utils';
import { IconButton } from '@arundo/marathon-shared';
import { EditInvestigationType } from './edit';
import usePagination from '~/hooks/usePagination';

const ToolButton = styled(IconButton)`
  margin-right: 30px;
`;

const Main = styled.main`
  overflow-y: auto;
  padding: 0;
  height: 100%;
`;

const ContentSection = styled(ContentSectionBase)`
  display: grid;
  padding: 30px 100px 100px 100px;
`;

const SearchDiv = styled.div`
  max-height: 180px;
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  justify-content: space-between;
`;

const ActionSpan = styled.div`
  display: flex;
`;

export interface ListProps<T extends MarathonItem> {
  allItems: T[];
  filteredItems: T[];
  limit?: number;
}

type InvestigationsListProps = ListProps<InvestigationType>;

const byName = ascBy<InvestigationType>('name');

export const Investigations = React.memo<InvestigationsListProps>(() => {
  const { investigationTypes } = useMarathon();
  const category = 'investigationTypes';
  const [editOpen, setEditOpen] = useState(false);
  const [investigationType, setInvestigationType] = useState(null);
  const searchHook = useSearch({
    items: investigationTypes,
    namespace: category,
    initial: {
      terms: '',
      tokens: [],
      config: {},
    },
  });
  const { highlighter, results, isSearching } = searchHook;

  const sortedResult = sortBy<InvestigationType>(results, byName);
  const { current, currentPage, numberOfPages, jump } = usePagination(
    sortedResult,
    6
  );

  return (
    <Main>
      {!editOpen ? (
        <ContentSection>
          <SearchDiv>
            <ActionSpan>
              <ToolButton icon={PlusIcon}>{'Create'}</ToolButton>
            </ActionSpan>
            <SearchInput searchHook={searchHook} />
          </SearchDiv>
          {isSearching && results.length > 0 ? (
            <p>
              Showing {`${0}-${results.length} of`} {results.length} matching
              items
            </p>
          ) : (
            <></>
          )}
          <FastDataTable<InvestigationType>
            columns={[
              {
                title: '',
                getValue: (group) => group?.name,
                columnStyles: `
                    height: 80px;
                  `,
              },
            ]}
            items={current}
            limit={6}
            highlighter={highlighter}
            rowCursor={true}
            onRowClick={(_, item) => {
              setInvestigationType(item);
              setEditOpen(true);
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
      ) : (
        <ContentSection>
          <EditInvestigationType
            investigationType={investigationType}
            setEditOpen={setEditOpen}
          />
        </ContentSection>
      )}
    </Main>
  );
});

Investigations.displayName = 'index';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Group } from '~/classes/Group';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { PlusIcon } from '~/components/misc/icons';
import { SearchInput } from '~/components/misc/searchInput';
import { Paginator } from '~/components/misc/pagination';
import { MarathonItem } from '@arundo/marathon-shared';
import { useSearch } from '~/hooks/useSearch';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy, sortBy, getDiffDays } from '~/utils';
import { IconButton } from '@arundo/marathon-shared';
import { PageWithSubmenu } from '~/components/misc/PageWithSubmenu';
import { GroupForm } from './groupForm';
import usePagination from '~/hooks/usePagination';

const ToolButton = styled(IconButton)`
  margin-right: 30px;
`;

const Main = styled.main`
  overflow-y: hidden;
  padding: 0;
  height: 100%;
`;

const ContentSection = styled(ContentSectionBase)`
  display: grid;
  padding: 30px 100px 100px 100px;
`;

const SearchDiv = styled.div`
  display: flex;
  flex-direction: row;
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

type GroupsListProps = ListProps<Group>;

const byName = ascBy<Group>('name');

export const Groups = React.memo<GroupsListProps>(() => {
  const { groups } = useMarathon();
  const category = 'groups';
  const [formOpen, setFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const searchHook = useSearch({
    items: groups,
    namespace: category,
    initial: {
      terms: '',
      tokens: [],
      config: {},
    },
  });
  const { highlighter, results } = searchHook;

  const sortedResult = sortBy<Group>(results, byName);
  const { current, currentPage, numberOfPages, jump } = usePagination(
    sortedResult,
    6
  );

  return (
    <Main>
      <PageWithSubmenu
        menuItems={[
          { label: 'Users', to: '/users/users' },
          { label: 'Groups', to: '/users/groups' },
        ]}
      >
        {!formOpen ? (
          <ContentSection>
            <SearchDiv>
              <ActionSpan>
                <ToolButton icon={PlusIcon} onClick={() => setFormOpen(true)}>
                  {'Create'}
                </ToolButton>
              </ActionSpan>
              <SearchInput searchHook={searchHook} />
            </SearchDiv>
            <FastDataTable<Group>
              columns={[
                {
                  title: 'Name',
                  getValue: (group) => group?.name,
                  columnStyles: `
                    height: 80px;
                  `,
                },
                {
                  title: 'Description',
                  getValue: (group) => group?.description,
                },
                {
                  title: 'Users',
                  getValue: (group) => group?.users?.length?.toString(),
                },
                {
                  title: 'Created',
                  getValue: (group) =>
                    group?.insertedAt
                      ? getDiffDays(group?.insertedAt) + ' days ago'
                      : '',
                },
              ]}
              items={current}
              limit={6}
              highlighter={highlighter}
              rowCursor={false}
              onRowClick={(_, item) => {
                setSelectedGroup(item);
                setFormOpen(true);
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
            <GroupForm
              group={selectedGroup}
              edit={selectedGroup ? true : false}
              setSelectedGroup={setSelectedGroup}
              setFormOpen={setFormOpen}
            />
          </ContentSection>
        )}
      </PageWithSubmenu>
    </Main>
  );
});

Groups.displayName = 'index';

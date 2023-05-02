import React, { useState } from 'react';
import styled from 'styled-components';
import { User } from '~/classes/User';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { FastDataTable } from '~/components/misc/fastDataTable';
import { GroupChips } from '~/components/misc/groupChip';
import {
  ImportIcon,
  ExportIcon,
  PlusIcon,
  ActiveIcon,
  InactiveIcon,
  InvitedIcon,
} from '~/components/misc/icons';
import { SearchInput } from '~/components/misc/searchInput';
import { Paginator } from '~/components/misc/pagination';
import { MarathonItem } from '@arundo/marathon-shared';
import { useSearch } from '~/hooks/useSearch';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy, sortBy, getDiffDays } from '~/utils';
import { IconButton } from '@arundo/marathon-shared';
import { PageWithSubmenu } from '~/components/misc/PageWithSubmenu';
import { SearchDiv } from '~/components/misc/formChangeDiv';
import { ImportUser } from './ImportUser';
import { UserForm } from './userForm';
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

const ActionSpan = styled.div`
  display: flex;
`;

export interface ListProps<T extends MarathonItem> {
  allItems: T[];
  filteredItems: T[];
  limit?: number;
}

type UsersListProps = ListProps<User>;

const byName = ascBy<User>('firstName');

export const Users = React.memo<UsersListProps>(() => {
  const { users } = useMarathon();
  const category = 'users';
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchHook = useSearch({
    items: users,
    namespace: category,
    initial: {
      terms: '',
      tokens: [],
      config: {},
    },
  });
  const { highlighter, results } = searchHook;

  const sortedResult = sortBy<User>(results, byName);
  const { current, currentPage, numberOfPages, jump } = usePagination(
    sortedResult,
    10
  );

  return (
    <Main>
      <PageWithSubmenu
        menuItems={[
          { label: 'Users', to: '/users/users' },
          { label: 'Groups', to: '/users/groups' },
        ]}
      >
        {!formOpen && !importOpen ? (
          <ContentSection>
            <SearchDiv>
              <ActionSpan>
                <ToolButton icon={PlusIcon} onClick={() => setFormOpen(true)}>
                  {'Invite'}
                </ToolButton>
                <ToolButton
                  icon={ImportIcon}
                  onClick={() => setImportOpen(true)}
                >
                  {'Import'}
                </ToolButton>
                <ToolButton icon={ExportIcon}>{'Export'}</ToolButton>
              </ActionSpan>
              <SearchInput searchHook={searchHook} />
            </SearchDiv>
            <div> Showing {(currentPage - 1) * 10 + 1} - {(currentPage - 1) * 10 + current?.length} of {results?.length} matching items </div>
            <FastDataTable<User>
              columns={[
                {
                  title: 'Name',
                  getValue: (user) => user?.firstName + ' ' + user?.lastName,
                },
                {
                  title: 'Email',
                  getValue: (user) => user?.email,
                },
                {
                  title: 'Status',
                  getValue: (user) => user?.status,
                  render: (user) =>
                    user?.status === 'Active' ? (
                      <>
                        <ActiveIcon /> {user?.status}
                      </>
                    ) : user?.status === 'Inactive' ? (
                      <>
                        <InactiveIcon /> {user?.status}
                      </>
                    ) : (
                      <>
                        <InvitedIcon /> {user?.status}
                      </>
                    ),
                  columnStyles: `
                      min-width: 100px;
                    `,
                },
                {
                  title: 'Groups',
                  getValue: (user) => user?.id,
                  // eslint-disable-next-line react/display-name
                  render: (user) => (
                    <GroupChips groups={user?.groups}></GroupChips>
                  ),
                  columnStyles: `
                      width: 180px;
                      height:90px;
                    `,
                },                 
                {
                  title: 'Invited',
                  getValue: (user) =>
                    user?.invitedAt
                      ? getDiffDays(user?.invitedAt) + ' days ago'
                      : '',
                },
                {
                  title: 'Created',
                  getValue: (user) =>
                    user?.insertedAt
                      ? getDiffDays(user?.insertedAt) + ' days ago'
                      : '',
                },
                {
                  title: 'Last Login',
                  getValue: (user) =>
                    user?.lastSuccessfulLogin
                      ? getDiffDays(user?.lastSuccessfulLogin) + ' days ago'
                      : '',
                },
              ]}
              items={current}
              limit={10}
              highlighter={highlighter}
              rowCursor={true}
              onRowClick={(_, item) => {
                setSelectedUser(item);
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
        ) : formOpen ? (
          <ContentSection>
            <UserForm
              user={selectedUser}
              edit={selectedUser ? true : false}
              setSelectedUser={setSelectedUser}
              setFormOpen={setFormOpen}
            />
          </ContentSection>
        ) : (
          <ContentSection>
            <ImportUser setFormOpen={setImportOpen} />
          </ContentSection>
        )}
      </PageWithSubmenu>
    </Main>
  );
});

Users.displayName = 'index';

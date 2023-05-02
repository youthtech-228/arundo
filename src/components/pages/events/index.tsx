import React, { useState } from 'react';
import styled from 'styled-components';
import { EventType } from '~/classes/EventType';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { FastDataTable } from '~/components/misc/fastDataTable';
import {
  PlusIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from '~/components/misc/icons';
import { SearchInput } from '~/components/misc/searchInput';
import { Paginator } from '~/components/misc/pagination';
import { MarathonItem } from '@arundo/marathon-shared';
import { useSearch } from '~/hooks/useSearch';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy, sortBy, formatDateString } from '~/utils';
import { IconButton } from '@arundo/marathon-shared';
import { SearchDiv } from '~/components/misc/formChangeDiv';
import { Severity } from '~/components/misc/severity';
import { EventForm } from './eventForm';
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

type EventsListProps = ListProps<EventType>;

const byEventTypeName = ascBy<EventType>('name');

export const Events = React.memo<EventsListProps>(() => {
  const { eventTypes } = useMarathon();
  const category = 'eventTypes';
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const searchHook = useSearch({
    items: eventTypes,
    namespace: category,
    initial: {
      terms: '',
      tokens: [],
      config: {},
    },
  });
  const { highlighter, results } = searchHook;

  const sortedResult = sortBy<EventType>(results, byEventTypeName);
  const { current, currentPage, numberOfPages, jump } = usePagination(
    sortedResult,
    10
  );

  return (
    <Main>
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
          <div> Showing {(currentPage - 1) * 10 + 1} - {(currentPage - 1) * 10 + current?.length} of {results?.length} matching items </div>
          <FastDataTable<EventType>
            columns={[
              {
                title: 'Name',
                getValue: (eventType) => eventType?.name,
                columnStyles: `
                  height: 80px;
                `,
              },
              {
                title: 'Severity',
                getValue: (eventType) => eventType?.severity?.id,
                // eslint-disable-next-line react/display-name
                render: (eventType) => <Severity eventType={eventType} />,
              },
              {
                title: 'Alert Stream',
                getValue: (eventType) => eventType?.isAlertStream.toString(),
                // eslint-disable-next-line react/display-name
                render: (eventType) =>
                  eventType?.isAlertStream ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  ),
              },
              {
                title: 'Visibility',
                getValue: (eventType) => eventType?.visibleToRoles[0],
              },
              {
                title: 'Created',
                getValue: (eventType) => formatDateString(eventType?.createdDate)
              },
            ]}
            items={current}
            limit={10}
            highlighter={highlighter}
            rowCursor={true}
            onRowClick={(_, item) => {
              setSelectedEventType(item);
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
          <EventForm
            eventType={selectedEventType}
            setEventType={setSelectedEventType}
            edit={selectedEventType ? true : false}
            setFormOpen={setFormOpen}
          />
        </ContentSection>
      )}
    </Main>
  );
});

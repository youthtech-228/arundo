import React, { useState } from 'react';
import styled from 'styled-components';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { GraphTypeCard } from '~/components/misc/graphTypeCard';
import { GraphType } from '~/classes/graphType';
import {
  PlusIcon
} from '~/components/misc/icons';
import { MarathonItem } from '@arundo/marathon-shared';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy, sortBy } from '~/utils';
import { IconButton } from '@arundo/marathon-shared';
import { SearchDiv } from '~/components/misc/formChangeDiv';
import { Form } from './form';

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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  grid-gap: 0.6em;
  margin-bottom: 1em;
  margin-top: 1em;
`;

export interface ListProps<T extends MarathonItem> {
  allItems: T[];
  filteredItems: T[];
  limit?: number;
}

type GraphTypeListProps = ListProps<GraphType>;

const byGraphTypeName = ascBy<GraphType>('name');

export const GraphTypes = React.memo<GraphTypeListProps>(() => {
  const { graphTypes } = useMarathon();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedGraphType, setSelectedGraphType] = useState(null);

  const sortedResult = sortBy<GraphType>(graphTypes, byGraphTypeName);

  return (
    <Main>
      {!formOpen ? (
        <ContentSection>
          <SearchDiv>
            <ActionSpan>
              <b>{'Graphs'}</b>
            </ActionSpan>
            <ToolButton icon={PlusIcon} onClick={() => setFormOpen(true)}>
              {'Create New Graph'}
            </ToolButton>
          </SearchDiv>
          <CardGrid>
            {
              sortedResult.map((graphType) => (
                <GraphTypeCard 
                  key={graphType.id}
                  graphType={graphType} 
                  onClick={()=> {
                    setSelectedGraphType(graphType);
                    setFormOpen(true);
                  }}
                />
              ))
            }
          </CardGrid>
        </ContentSection>
      ) : (
        <ContentSection>
          <Form
            setSelectedGraphType={setSelectedGraphType} 
            edit={selectedGraphType ? true : false}  
            graphType={selectedGraphType}
            setFormOpen={setFormOpen}
          />
        </ContentSection>
      )}
    </Main>
  );
});

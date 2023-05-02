import React from 'react';
import { ContentSection } from '~/components/Layout/contentSection';
import { useMarathon } from '~/contexts/marathonContext';
import styled from 'styled-components';

const LoadingIndicator = styled.div<{ $loading: boolean }>`
  transition: all 0.3s;
  color: ${(props) => (props.$loading ? '#ddd' : '#222')};
  font-size: 1.5em;
`;

export const Loading = () => {
  const { loading } = useMarathon();

  return (
    <ContentSection>
      <LoadingIndicator $loading={loading.assetTypes}>
        {loading.assetTypes ? 'loading types...' : `loaded asset types.`}
      </LoadingIndicator>
      <LoadingIndicator $loading={loading.assets}>
        {loading.assets ? 'loading assets...' : `loaded assets.`}
      </LoadingIndicator>
      <LoadingIndicator $loading={loading.eventTypes}>
        {loading.eventTypes ? 'loading event types...' : `loaded event types.`}
      </LoadingIndicator>
      <LoadingIndicator $loading={loading.investigations}>
        {loading.investigations
          ? 'loading investigations...'
          : `loaded investigations.`}
      </LoadingIndicator>
      <LoadingIndicator $loading={loading.users}>
        {loading.users ? 'loading users...' : `loaded users types.`}
      </LoadingIndicator>
    </ContentSection>
  );
};

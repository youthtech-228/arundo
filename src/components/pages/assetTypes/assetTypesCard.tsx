import React from 'react';
import styled from 'styled-components';
import { AssetTypeCard } from '~/components/misc/assetTypeCard';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  grid-gap: 0.6em;
  margin-bottom: 1em;
  margin-top: 1em;
`;

export const AssetTypesCards = ({ assetTypes = [] }) => {
  return (
    <CardGrid>
      {assetTypes.map((assetType) => (
        <AssetTypeCard key={assetType.id} assetType={assetType} />
      ))}
    </CardGrid>
  );
};

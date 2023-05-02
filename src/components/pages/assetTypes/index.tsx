import React from 'react';
import { PageWithSearch } from '~/components/misc/pageWithSearch';
import { SidePanel } from '~/components/sidePanel';
import { useMarathon } from '~/contexts/marathonContext';
import { useSearch } from '~/hooks/useSearch';
import { AssetTypeBrowser } from './assetTypeBrowser';
import { AssetTypesList } from './assetTypesList';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { AssetType } from '~/classes/assetType';

const Main = styled.main`
  overflow-y: hidden;
  padding: 0;
  height: 100%;
`;

type AssetTypesParams = {
  idOrSlug?: string;
};

// function to getRelativePaths of assets and sort lexagraphically - replace assets array with sorted
const sortByPath = (assetTypes: AssetType[]): AssetType[] => {
  return Array.from(assetTypes).sort((a, b) => {
    if (a?.path > b?.path) {
      return 1;
    }
    if (b?.path > a?.path) {
      return -1;
    }
    return 0;
  });
};

export const AssetTypes = React.memo(function Assets() {
  const { searchItems } = useMarathon();
  const { idOrSlug } = useParams<AssetTypesParams>();
  const assetTypeCategory = 'asset type';

  const searchHook = useSearch({
    items: searchItems,
    namespace: assetTypeCategory,
    initial: {
      terms: '',
      tokens: [],
      config: {},
    },
  });
  const { highlighter, isSearching, navigateFromSearch, returnToSearch } =
    searchHook;

  const renderAssetList = (filteredItems: AssetType[]) => (
    <AssetTypesList
      filteredItems={filteredItems}
      onNavigate={navigateFromSearch}
      highlighter={highlighter}
    />
  );

  return (
    <>
      <SidePanel />
      <Main>
        <PageWithSearch
          category={assetTypeCategory}
          searchHook={searchHook}
          autofocus
          sortResults={(assetTypes: AssetType[]) => sortByPath(assetTypes)}
          resultsRenderer={renderAssetList}
        >
          <AssetTypeBrowser
            returnToSearch={returnToSearch}
            visible={!isSearching}
            idOrSlug={idOrSlug}
          />
        </PageWithSearch>
      </Main>
    </>
  );
});

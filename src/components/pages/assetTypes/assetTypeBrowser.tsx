import React, { useState } from 'react';
import styled from 'styled-components';
import { ContentSection as ContentSectionBase } from '~/components/Layout/contentSection';
import { Breadcrumbs } from '~/components/misc/breadcrumbs';
import { CreateIcon, EditIcon } from '~/components/misc/icons';
import { IconButton } from '@arundo/marathon-shared';
import { Form } from './assetTypeForm';
import { Asset } from '~/classes/asset';
import { AssetType } from '~/classes/AssetType';
import {
  useMarathon,
  useSyncAssetTypeTarget,
} from '~/contexts/marathonContext';
import { AssetTypesCards as BaseAssetTypesCards } from './assetTypesCard';
import { AssetsList } from './assetsList';
import { ReturnToSearch } from '@arundo/marathon-shared';

const ContentSection = styled(ContentSectionBase)`
  overflow-x: hidden;
  overflow-y: hidden !important;
  display: grid;
  grid-template: minmax(0, 1fr) auto / 1fr;
  padding: 0;

  & > div:first-of-type {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem;
    width: 100%;
    overflow-x: hidden;
  }
`;

const AssetTypesCards = styled(BaseAssetTypesCards)`
  grid-column: 1;
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

interface Props {
  idOrSlug?: string;
  returnToSearch: () => void;
  visible: boolean;
}

const sortByPath = (assets: Asset[]): Asset[] => {
  return Array.from(assets).sort((a, b) => {
    if (a?.path > b?.path) {
      return 1;
    }
    if (b?.path > a?.path) {
      return -1;
    }
    return 0;
  });
};

export const AssetTypeBrowser = React.memo<Props>(
  ({ idOrSlug, returnToSearch, ...props }) => {
    useSyncAssetTypeTarget(idOrSlug);
    let { currentAssetType: current } = useMarathon();
    const { assetTypes, marathon } = useMarathon();

    const [formOpen, setFormOpen] = useState(false);
    const [edit, setEditOpen] = useState(false);

    current = current || assetTypes.getRoot();

    const children =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (current?.children ?? assetTypes.byParent[undefined]) || [];

    const formOptions = {
      setEditOpen,
      setFormOpen,
      edit: edit,
      assetType: new AssetType(
        {
          name: '',
          slug: '',
          dataSourceId: '351b948b-0011-48a6-9fec-ff4ea2c92024',
          assetViewId: '',
          parentId: current ? current?.id : '',
          eventTypeId: '',
          id: '',
          assetViewName: '',
        },
        marathon
      ),
    };

    return (
      <ContentSection {...props}>
        <div>
          <ReturnToSearch returnToSearch={returnToSearch} />
          {current ? (
            <>
              <SplitPane>
                <Breadcrumbs assetType={current} formOpen={formOpen} />
                {!formOpen ? (
                  <IconButton
                    icon={EditIcon}
                    onClick={() => {
                      setEditOpen(true);
                      setFormOpen(true);
                    }}
                  >
                    {'Edit'}
                  </IconButton>
                ) : (
                  <></>
                )}
                {!formOpen ? (
                  <IconButton
                    icon={CreateIcon}
                    onClick={() => setFormOpen(true)}
                  >
                    {'Add new type'}
                  </IconButton>
                ) : (
                  <></>
                )}
              </SplitPane>
            </>
          ) : null}
          {!formOpen ? (
            <AssetTypesCards assetTypes={children} />
          ) : (
            <Form {...formOptions} />
          )}

          {current && current.instances?.length > 0 && !formOpen ? (
            <AssetsList filteredItems={sortByPath(current?.instances)} />
          ) : (
            <></>
          )}
        </div>
      </ContentSection>
    );
  }
);

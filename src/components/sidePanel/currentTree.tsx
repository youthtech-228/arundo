import React from 'react';
import { useMarathon } from '~/contexts/marathonContext';
import { Tree } from './tree';
import { AssetType } from '~/classes/assetType';

interface Props {
  roots: Array<AssetType>;
}

export const CurrentTree = React.memo<Props>(function CurrentTree({ roots }) {
  const { hasChanged } = useMarathon();

  if (!roots) return null;

  return (
    <>
      {roots.map((assetType) => (
        <Tree key={assetType.id + hasChanged} assetType={assetType} />
      ))}
    </>
  );
});

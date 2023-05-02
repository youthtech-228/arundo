import React from 'react';
import styled from 'styled-components';
import { DraggableAssetLink } from '~/components/misc/draggableAssetLink';
import { useStore } from '~/hooks/useStore';
import { AssetType } from '~/classes/assetType';

const StyledSidebarMessage = styled.div`
  color: rgba(255, 255, 255, 0.3);
  font-size: 2.1em;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 2em 2em;
  letter-spacing: -0.05em;
  line-height: 1.2em;
`;

const StyledNode = styled.div<{
  hasChildren?: boolean;
  isRoot?: boolean;
  lastChild?: boolean;
}>`
  // margin-left: 0.5em;
  position: relative;
  padding-left: 0.9em;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 1em;
    width: 0.7em;
    border-left: 1px solid #888;
    border-bottom: 1px solid #888;
    display: ${(props) => (props.isRoot ? 'none' : 'block')};
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0.7em;
    border-left: ${(props) => (props.lastChild ? 'none' : '1px solid #888')};
    display: block;
  }
`;

const StyledTree = styled.div<{ isRoot?: boolean }>`
  display: flex;
  flex-flow: column;
  flex: 1 100%;
  margin-left: ${(props) => (props.isRoot ? 0 : '0.5em')};
`;

const CollapseHandle = styled.a<{ collapsed?: boolean }>`
  background-color: #666; //${(props) => (props.collapsed ? 'green' : 'red')};
  height: 0.8em;
  font-weight: lighter;
  width: 0.8em;
  overflow: hidden;
  position: absolute;
  outline: 1px solid #aaa;
  top: 0.6em;
  margin-left: 0.15em;
  color: #ddd;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:before {
    content: '${(props) => (props.collapsed ? '+' : '-')}';
    line-height: ${(props) => (props.collapsed ? '0.75em' : '0.35em')};
    font-size: ${(props) => (props.collapsed ? '1em' : '2em')};
  }
`;

const SpacedForToggles = styled.div<{ hasChildren?: boolean }>`
  margin-left: ${(props) => (props.hasChildren ? '1.4em' : '0')};
`;

interface Props {
  isRoot?: boolean;
  assetType: AssetType;
  lastChild?: boolean;
  root?: boolean;
}

export const Tree = React.memo<Props>(
  ({ isRoot = false, assetType, lastChild = true, root = true }) => {
    const [expanded, setExpanded] = useStore(
      `tree:expanded:${assetType.id}`,
      false,
      { persist: true }
    );
    const toggleExpanded = () => setExpanded(!expanded);

    if (!assetType) {
      return (
        <StyledSidebarMessage>
          There are no asset types matching that description.
        </StyledSidebarMessage>
      );
    }

    const visibleChildren = assetType.children;

    // ENABLE TO CHECK TREE NODE RENDERINGS
    // console.log('rendering Tree node')

    return (
      <StyledTree isRoot={isRoot}>
        <StyledNode
          hasChildren={assetType.hasChildren}
          lastChild={lastChild}
          isRoot={root}
        >
          {assetType.hasChildren ? (
            <CollapseHandle onClick={toggleExpanded} collapsed={!expanded} />
          ) : null}

          <SpacedForToggles hasChildren={assetType.hasChildren}>
            <DraggableAssetLink assetType={assetType} />
          </SpacedForToggles>

          {expanded &&
            visibleChildren.map((child, i) => (
              <Tree
                key={child.id}
                assetType={child}
                lastChild={i === visibleChildren.length - 1}
                root={false}
              />
            ))}
        </StyledNode>
      </StyledTree>
    );
  }
);

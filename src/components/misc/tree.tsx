import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AssetType } from '~/classes/assetType';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Checkbox } from '@arundo/marathon-shared';

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
  position: relative;
  padding-left: 0.9em;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 1em;
    width: 0.7em;
    display: ${(props) => (props.isRoot ? 'none' : 'block')};
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0.7em;
    display: block;
  }
`;

const StyledTree = styled.div<{ isRoot?: boolean }>`
  display: flex;
  flex-flow: column;
  flex: 1 100%;
  margin-left: ${(props) => (props.isRoot ? 0 : '0.5em')};
`;

const SelectedTreeNode = styled.div<{ color?: string; multi?: boolean }>`
  color: ${(props) => props?.color};
  font-weight: bold;
  margin-left: ${(props) => (props.multi ? '5px' : '0px')};
`;

const TreeNodeName = styled.div<{ multi?: boolean }>`
  margin-left: ${(props) => (props.multi ? '5px' : '0px')};
`;

const StyledLink = styled.span`
  margin-top: 10px;
  padding: 0.3em 0.2em 0.2em 0.4em;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    text-decoration: none;
  }
  font-size: 0.6em;
`;

const CollapseHandle = styled.a<{ collapsed?: boolean }>`
  height: 0.8em;
  width: 0.8em;
  overflow: hidden;
  position: absolute;
  top: 0.6em;
  color: black;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }

  &:before {
    line-height: ${(props) => (props.collapsed ? '0.75em' : '0.35em')};
    font-size: ${(props) => (props.collapsed ? '0.6em' : '1em')};
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
  onTreeChange: (item: AssetType) => void;
  toggling: () => void;
  search: string;
  multi: boolean;
}

interface SelectionToggleProps {
  item: AssetType;
  selected: boolean;
  toggleSelected: (item: AssetType) => void;
}

const SelectionToggle = React.memo<SelectionToggleProps>(
  ({ item, selected, toggleSelected }) => {
    return (
      <Checkbox
        className="checkbox"
        checked={selected}
        onChange={() => toggleSelected(item)}
      />
    );
  }
);

SelectionToggle.displayName = 'SelectionToggle';

export const Tree = React.memo<Props>(
  ({
    isRoot = false,
    assetType,
    values = [],
    lastChild = true,
    root = true,
    onTreeChange = undefined,
    toggling = undefined,
    search: searchVal = '',
    multi = false,
  }) => {
    const search = (!multi && values[0]?.assetTypeName) ? values[0]?.assetTypeName : searchVal;
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      if (search) {
        setExpanded(assetType.getChildren({ deep: true })
          .some(child => child.name.toLowerCase().includes(search.toLowerCase()))
        )
      }
    }, [assetType, search]);

    const toggleExpanded = () => setExpanded(!expanded);
    if (!assetType) {
      return (
        <StyledSidebarMessage>
          There are no asset types matching that description.
        </StyledSidebarMessage>
      );
    }

    const visibleChildren = assetType.children;

    return (!search || assetType.name.toLowerCase().includes(search.toLowerCase()) || expanded) && (
      <StyledTree isRoot={isRoot}>
        <StyledNode
          hasChildren={assetType.hasChildren}
          lastChild={lastChild}
          isRoot={root}
        >
          {assetType.hasChildren ? (
            <CollapseHandle onClick={toggleExpanded} collapsed={!expanded}>
              {!expanded ? <ChevronRightIcon /> : <ExpandMoreIcon />}
            </CollapseHandle>
          ) : null}

          <SpacedForToggles hasChildren={assetType.hasChildren}>
            <StyledLink
              onClick={() => {
                onTreeChange(assetType);
                if (!multi) {
                  toggling(false);
                }
              }}
            >
              {multi ? (
                <SelectionToggle
                  item={assetType}
                  selected={
                    values.find((value) => value.assetTypeId == assetType.id)
                      ? true
                      : false
                  }
                  toggleSelected={onTreeChange}
                />
              ) : (
                <></>
              )}

              {!values.find((value) => value.assetTypeId == assetType.id) ? (
                  <TreeNodeName multi={multi}>{assetType?.name}</TreeNodeName>
              ) : (
                <SelectedTreeNode multi={multi} color={'#fb7e23'}>
                  {assetType?.name}
                </SelectedTreeNode>
              )}
            </StyledLink>
          </SpacedForToggles>

          {expanded &&
            visibleChildren.map((child, i) => (
              <Tree
                key={child.id}
                assetType={child}
                values={values}
                onTreeChange={onTreeChange}
                lastChild={i === visibleChildren.length - 1}
                root={false}
                toggling={toggling}
                search={search}
                multi={multi}
              />
            ))}
        </StyledNode>
      </StyledTree>
    );
  }
);

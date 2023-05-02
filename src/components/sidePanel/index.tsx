import TreeIcon from '@material-ui/icons/AccountTreeOutlined';
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/KeyboardArrowLeft';
import React from 'react';
import styled from 'styled-components';
import { useMarathon } from '~/contexts/marathonContext';
import { ascBy } from '~/utils';
import { useStore } from '~/hooks/useStore';
import { CurrentTree } from './currentTree';
import { IconButton } from '@arundo/marathon-shared';

const StyledSidePanel = styled.aside<{ isOpen: boolean }>`
  background-color: #404040;
  cursor: ${(props) => (props.isOpen ? 'default' : 'pointer')};
  display: flex;
  flex-flow: column;
  padding: 1em 0 0 1em;
  position: relative;
  transition: all 0.2s ease;
  width: ${(props) => (props.isOpen ? '23rem' : '3rem')};
  font-weight: 400;

  > * {
    display: block;
  }

  main {
    position: relative;
    transition: all 0.2s ease;
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    overflow: ${(props) => (props.isOpen ? 'hidden' : 'none')};
    width: 22rem;
    overflow-y: ${(props) => (props.isOpen ? 'auto' : 'hidden')};
    flex: 1;
    z-index: ${(props) => (props.isOpen ? '1' : '-1')};
  }

  &:hover {
    background-color: ${(props) => (props.isOpen ? 'auto' : '#494949')};
  }
`;

const StyledResults = styled.div`
  position: relative;
  // flex: 1;
  margin-top: 1.5em;
  overflow-y: auto;
  padding: 0 1em 1em 0;
`;

const StyledSidepanelContent = styled.main`
  width: 23rem;
  display: flex;
  flex-flow: column;
`;

const PinnedLabel = styled.label<{ visible?: boolean }>`
  color: #fff;
  font-size: 1.1em;
  position: absolute;
  transform: rotate(-90deg);
  transform-origin: top right;
  padding: 0.7rem;
  right: ${({ visible }) => (visible ? '100%' : '100%')};
  top: 3rem;
  white-space: nowrap;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: all 0.4s ease;
  cursor: pointer;
`;

export const SidePanel = styled(
  React.memo(({ className }: { className?: string }) => {
    const [isOpen, setIsOpen] = useStore('asset-tree:isOpen', false, {
      persist: true,
    });
    const { assetTypes } = useMarathon();

    const roots =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (assetTypes.byParent[undefined] || []).sort(ascBy('name'));
    const RootName = (assetTypes.getRoot() || {}).name || 'Project Root';

    return (
      <StyledSidePanel
        isOpen={isOpen}
        className={className}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        <IconButton
          icon={TreeIcon}
          iconActive={CloseIcon}
          active={isOpen}
          activeColor="white"
          onClick={() => setIsOpen(!isOpen)}
          hoverColor="white"
          customStyle={`
          font-size: 1rem;
          margin-bottom: 1rem;
          flex: 0 2rem;
          height: 2rem;
          overflow: hidden;
          white-space: nowrap;
          color: ${isOpen ? 'rgb(251, 126, 0)' : 'white'};

          svg {
            height: 1.5rem;
            width: 1.5rem;
          }

          > * {
            position: ${isOpen ? 'absolute' : 'inherit'};
            right: 1em;
          }
        `}
        >
          {isOpen ? 'close asset type navigation' : ''}
        </IconButton>

        <PinnedLabel visible={!isOpen}>
          <IconButton
            icon={HomeIcon}
            color="#fb7e23"
            customStyle={`
            position: relative;
            bottom: -0.25rem;
            margin-right: 0.5rem;
            display: inline-block;

            svg {
              position: relative;
              top: -0.15rem;
            }
          `}
          >
            Home is
          </IconButton>
          {RootName}
        </PinnedLabel>

        <SidePanelInner roots={roots} />
      </StyledSidePanel>
    );
  })
)``;

export const SidePanelInner = ({ roots }) => {
  return (
    <StyledSidepanelContent>
      <StyledResults>
        <CurrentTree roots={roots} />
      </StyledResults>
    </StyledSidepanelContent>
  );
};

import { Tooltip } from '@arundo/marathon-shared';
import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

type Direction = 'up' | 'down' | 'left' | 'right';

interface MenuAction {
  text: string;
  value: string;
}

interface Props {
  enterDelay?: number;
  direction?: Direction;
  title?: string;
  selectedValue: string;
  options: MenuAction[];
  onSelect: (value: string) => void;
}

const borderWidth = 2;
const Container = styled.div<{ showMenu }>`
  line-height: 1;
  position: relative;
  font-family: Arial, sans-serif;
  border: ${borderWidth}px solid #aaa;
  padding: 1em;
  box-shadow: ${({ showMenu }) =>
    showMenu ? 'var(--drop-shadow)' : 'inherit'};
`;

const MenuItem = styled.div<{
  selected: boolean;
  disabled: boolean;
}>`
  background: ${({ selected, disabled }) =>
    !disabled && selected ? 'var(--accent-color)' : 'inherit'};
  color: ${({ selected, disabled }) =>
    disabled ? '#c9c9c9' : selected ? 'white' : 'inherit'};
  cursor: pointer;
  padding: 1em 2em;
  position: relative;

  &:not(:first-child)::before {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    top: -1px;
    height: 1px;
  }

  &:hover {
    background: ${({ disabled }) =>
      disabled ? 'inherit' : 'var(--accent-color)'};
    color: ${({ disabled }) => (disabled ? '#c9c9c9' : 'white')};
  }
`;

const Menu = styled.div<{
  show: boolean;
  delay?: number;
}>`
  padding: 0;
  opacity: ${({ show }) => (!show ? 0 : 1)};
  visibility: ${({ show }) => (!show ? 'hidden' : 'visible')};
  transition: opacity 100ms linear, visibility 100ms;
  transition-delay: ${({ delay = 200, show }) => (show ? delay : 0)}ms, 0ms;
  position: absolute;
  z-index: 10;
  background: white;
  color: black;
  font-weight: 400;
  width: calc(100% + ${borderWidth * 2}px);
  left: ${-borderWidth}px;
  top: calc(100% - ${borderWidth}px);
  clip-path: inset(0px -150px -150px -150px);
  box-shadow: var(--drop-shadow);
  border: ${borderWidth}px solid #aaa;
  border-top: none;
`;

export const DropdownMenu = ({
  selectedValue,
  direction,
  options,
  enterDelay = 200,
  onSelect,
  title = '',
}: Props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const elRef = useRef<HTMLDivElement>(null);

  const menuClickHandler = (value: string) => {
    onSelect(value);
    setShowMenu(false);
  };

  useEffect(() => {
    const clickHandler = () => {
      setShowMenu(!showMenu);
    };
    const blurHandler = ({ target }) => {
      if (!elRef.current?.contains(target)) {
        setShowMenu(false);
      }
      return false;
    };

    elRef.current?.addEventListener('click', clickHandler);
    document.addEventListener('click', blurHandler);

    return () => {
      elRef.current?.removeEventListener('click', clickHandler);
      document.removeEventListener('click', blurHandler);
    };
  }, [elRef.current, showMenu, setShowMenu]);

  return (
    <Container ref={elRef} showMenu={showMenu}>
      <Tooltip title={title} direction={direction} enterDelay={enterDelay}>
        {options.find((o) => o.value === selectedValue)?.text || ''}
      </Tooltip>
      <Menu delay={0} show={!title && showMenu}>
        {options.filter(Boolean).map(({ text, value }) => (
          <MenuItem
            disabled={!value}
            selected={value === selectedValue}
            key={text}
            onClick={() => menuClickHandler(value)}
          >
            {text}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
};

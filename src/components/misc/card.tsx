import styled from 'styled-components';

export interface CardProps {
  fullwidth?: boolean;
  centered?: boolean;
  transparent?: boolean;
}

export const Card = styled.div<CardProps>`
  padding: 0.7em 1em 0.8em 0.7em;
  background-color: rgba(210, 210, 210, 0.6);
  position: relative;
  transition: all 0.1s ease;
  text-decoration: none !important;

  &:not(.noHover) {
    border-left: 0.35rem solid transparent;
  }

  ${(props) => (props.fullwidth ? 'flex: 1 100%; grid-column: 1 / -1;' : '')}

  ${(props) =>
    props.centered
      ? 'display: flex; flex-flow: column; justify-content: center;'
      : ''}

  &:not(.noHover):hover {
    transform: scale(1.02);
    z-index: 1;
    ${(props) =>
      !props.transparent && 'box-shadow: 0.5em 0.5em 1em rgba(0,0,0,0.4);'}
  }

  &.active {
    text-decoration: none;
  }

  color: #111;
`;

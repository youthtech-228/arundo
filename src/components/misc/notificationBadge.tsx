import styled from 'styled-components';
import { lightOrDark } from '~/utils';

const superscriptStyles = `
  font-size: 0.7em;
  padding: 0.1em 0.52em 0;
  position: relative;
  top: -0.6em;
  left: -0.1em;
`;

export const NotificationBadge = styled.span<{
  superscript?: boolean;
}>`
  display: inline-block;
  background-color: ${(props) => props.color || 'rgb(251, 126, 35)'};
  padding: 0.2em 0.7em 0.15em;
  color: ${(props) =>
    lightOrDark(props.color || 'rgb(251, 126, 35)') === 'dark'
      ? 'var(--background-color)'
      : 'var(--text-color)'};
  font-size: 0.9em;
  font-weight: 600;
  border-radius: 1em;
  text-transform: uppercase;
  box-shadow: 0.1em 0.1em 0.5em rgba(0, 0, 0, 0.05);
  // text-shadow: 0 0 0.4em rgb(0 0 0 / 20%);

  &:empty {
    display: none;
  }

  ${({ superscript }) => superscript && superscriptStyles}
`;

import styled, { css } from 'styled-components';

interface Props {
  visible?: boolean;
  centered?: boolean;
  fullwidth?: boolean;
  fullheight?: boolean;
}

export const ContentSection = styled.section<Props>`
  padding: 2rem;
  display: ${({ visible = true }) => (!visible ? 'none' : 'flex')};
  flex-direction: column;
  // height: 100%;

  ${({ centered }) =>
    centered &&
    css`
      flex: 1;
      justify-content: center;
      align-items: center;
    `}

  ${({ fullwidth }) =>
    fullwidth &&
    css`
      position: relative;
      padding: 1.5rem;
      flex-grow: 1;
    `}
  ${({ fullheight }) =>
    fullheight &&
    css`
      height: 100%;
    `}
`;

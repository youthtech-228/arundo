import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{
  fullwidth?: boolean;
  buttonType?: boolean;
}>`
  padding: 0.6rem 1rem;
  background-color: var(
    --${(props) => (props.buttonType ? 'background' : 'accent')}-color
  );
  color: var(
    --${(props) => (props.buttonType ? 'grey' : 'background')}-color
  );
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  border: 1px solid
    var(--${(props) => (props.buttonType ? 'grey' : 'accent')}-color);
  display: inline-block;
  cursor: pointer;
  min-width: 6.5rem;
  width: ${(props) => (props.fullwidth ? '100%' : 'auto')};
  &:hover {
    color: var(--background-color);
    background-color: var(
      --${(props) => (props.buttonType ? 'grey-color' : 'accent-hover')}
    );
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
      0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
  }
  &:disabled {
    color: rgba(0, 0, 0, 0.26);
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.12);
    cursor: default;
    pointer-events: none;
  }
`;

const StyledStatusButton = styled.button<{
  fullwidth?: boolean;
  activate?: boolean;
}>`
  padding: 0.6rem 1rem;
  background-color: var(--background-color);
  color: var(
    --${(props) => (props.activate ? 'Harley' : 'grey')}-color
  );
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  border: 1px solid
    var(--${(props) => (props.activate ? 'Harley' : 'grey')}-color);
  display: inline-block;
  cursor: pointer;
  min-width: 6.5rem;
  width: ${(props) => (props.fullwidth ? '100%' : 'auto')};
  &:hover {
    color: var(--background-color);
    background-color: var(
      --${(props) => (props.activate ? 'grey' : 'accent-hover')}
    );
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
      0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
  }
  &:disabled {
    color: rgba(0, 0, 0, 0.26);
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.12);
    cursor: default;
    pointer-events: none;
  }
`;
// export const Button = StyledButton;
export const Button = ({ whiteBg = false, fullwidth = false, ...props }) => {
  return <StyledButton buttonType={whiteBg} fullwidth={fullwidth} {...props} />;
};


export const StatusChangeButton = ({ activate = false, fullwidth = false, ...props }) => {
  return <StyledStatusButton activate={activate} fullwidth={fullwidth} {...props} />;
};
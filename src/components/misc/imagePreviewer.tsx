import React from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Close = styled.span`
  position: absolute;
  top: 15px;
  right: 35px;
  color: rgb(241, 241, 241);
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
`;
const ModalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 100px;
`;

export const ModalContent = ({ onClose, children }) => {
  return (
    <ModalContainer>
      <Close onClick={onClose}>
        &times;
      </Close>
      <ModalDiv >{children}</ModalDiv>
    </ModalContainer>
  );
};

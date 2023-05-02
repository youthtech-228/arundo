import React from 'react';
import styled from 'styled-components';
const Button = styled.button`
  border: 1px solid #000000;
  padding: 8px 20px 8px 20px;
  cursor: pointer;
`;
export const FileUploader = ({ imageUpload, ...props}) => {
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <>
      <Button onClick={handleClick}>
        Browse
      </Button>
      <input type="file"
        ref={hiddenFileInput}
        onChange={imageUpload}
        style={{display:'none'}} 
      /> 
    </>
  );
};

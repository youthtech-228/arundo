import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const RichText = styled(ReactQuill)`
  height: 200px;
  padding-bottom: 50px;
`;

export const RichTextEditor = ({
  onChangeInstruction,
  setInstruction,
  instruction,
  imageHandler,
}) => {
  const quillRef = useRef();

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [['image']],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, []);

  return (
    <RichText
      ref={quillRef}
      theme="snow"
      modules={modules}
      formats={['image']}
      onChange={onChangeInstruction}
      onFocus={() => setInstruction(instruction)}
      value={instruction.html}
    />
  );
};

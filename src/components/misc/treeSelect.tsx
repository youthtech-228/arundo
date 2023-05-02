import React, { useState, useEffect, useRef } from 'react';
import { EventAssetType } from '~/classes/EventType';
import { AssetType } from '~/classes/assetType';
import styled from 'styled-components';
import SearchIcon from '~/images/search_icon.svg';
import { Tree } from './tree';

const Input = styled.input<{
  error?: boolean;
  width?: string;
}>`
  border-top: none;
  border-left: none;
  border-right: none;
  min-width: ${(props) => props.width};
  width: 100%;
  line-height: 2.4em;
  overflow-x: hidden;
  overflow-y: hidden !important;
  transition: 0.3s;
  padding-left: 30px;
  &:focus {
    outline: none;
  }
  border-bottom: 1px solid #9e9e9e;
  border-bottom: ${(props) => (props.error ? '1px solid red' : '1px solid #9e9e9e')};
`;

const StyledInput = styled.div`
  &.inputWithIcon {
    position: relative;
  }
  .left-icon {
    width: 50px;
    position: relative;
    left: 5px;
    top: -20px;
    transform: translateY(-30%);
  }
`;

export const SearchboxWithLabel = styled.div`
  position: relative;
  flex: 1;
  max-width: 30rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  height: 44px;
`;

const DropDownContainer = styled.div<{
  width?: string;
}>`
  margin: 0 auto;
  width: ${(props) => props.width};
`;

const DropDownListContainer = styled.div<{
  width?: string;
}>`
  position: absolute;
  z-index: 9999;
  width: ${(props) => props.width == "100%" ? '41%' : props.width};
  margin-top: -22px;
`;

const DropDownList = styled('ul')`
  margin: 0;
  padding-bottom: 1em;
  background: #ffffff;
  box-shadow: 0px 0px 30px 3px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 1.3rem;
  font-weight: 400;
  &:first-child {
    padding-top: 0.8em;
  }
`;

interface Props {
  roots?: AssetType[];
  values: EventAssetType[];
  onTreeChange: (item: AssetType) => void;
  multi: boolean;
  width?: string;
  placeholder?: string;
}

export const TreeSelect = React.memo<Props>(function TreeSelect({
  roots = [],
  values,
  onTreeChange = undefined,
  multi = false,
  error = false,
  width = '450px',
  placeholder = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (isOpen && !multi) {
      setSearch(values[0]?.assetTypeName ?? '')
    }
  }, [isOpen])
  useEffect(() => {

    function handleClickOutside(event) {
      if (wrapperRef.current && ! wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("")
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const onSearch = (e) => { 
    if (!multi && values.length > 0) {
      onTreeChange({ id: values[0].assetTypeId });
    }
    setSearch(e.target.value);
  };

  const toggling = () => setIsOpen(!isOpen);

  return (
    <DropDownContainer ref={wrapperRef} width={width}>
      <StyledInput className={'inputWithIcon'} onClick={() => setIsOpen(true)}>
        <Input
          width={width}
          type="text"
          onSubmit={(e) => {
            e.preventDefault();
          }}
          value={
            isOpen
              ? search
              : !multi
              ? values.length > 0
                ? values[0].assetTypeName
                : ''
              : ''
          }
          error={error}
          onChange={onSearch}
          placeholder={placeholder}
        />
        <div className="left-icon">
          <img src={SearchIcon} />
        </div>
      </StyledInput>

      {isOpen && (
          <DropDownListContainer width={width}>
            <DropDownList>
              {roots.map((assetType) => (
                <Tree
                  key={assetType.id}
                  assetType={assetType}
                  values={values}
                  onTreeChange={onTreeChange}
                  toggling={toggling}
                  search={search}
                  multi={multi}
                />
              ))}
            </DropDownList>
          </DropDownListContainer>
        )
      }
    </DropDownContainer >
  );
});

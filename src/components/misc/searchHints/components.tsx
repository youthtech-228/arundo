import styled from 'styled-components';

export const HelperPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffff;
  position: absolute;
  top: 100%;
  padding: 1em;
  color: grey;
  border: 0.1em solid lightgrey;
  border-radius: 0.3rem 0.3rem 0.6rem 0.6rem;
  box-shadow: 0 0.1em 2em rgba(0, 0, 0, 0.1);
  z-index: 10;

  td {
    padding: 0.2em 0.4em 0.2em 0;
    font-size: 0.9em;

    &:last-child {
      padding-right: 0;
    }
  }
`;

export const Title = styled.div.attrs({
  role: 'title',
})`
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 0.8em;
`;

export const FilterName = styled.td`
  text-align: right;
  width: 1em;
`;

export const FilterDescription = styled.td``;

export const Badge = styled.span`
  display: inline-block;
  background: lightgrey;
  padding: 0.05em 0.5em 0.1em;
  border-radius: 0.3rem;
  color: #444;
  font-weight: 600;
`;

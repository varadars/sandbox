import styled from "styled-components";
import "../globals.css";

export const Tag = styled.div`
  font-size: 14px;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 3px 8px;
  margin: 10px;
  border-radius: 8px;
  width: max-content;

  &.secondary {
    background-color: var(--primary-dark);
    color: var(--primary-light);
  }
`;

export const HeaderTag = styled.div`
  font-size: 11px;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 3px 15px;
  margin: 10px;
  border-radius: 8px;
  width: max-content;

  &.secondary {
    background-color: var(--primary-dark);
    color: var(--primary-light);
  }
`;

import styled from "styled-components";

export const Tag = styled.div`
  font-size: 14px;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 3px 8px;
  border-radius: 8px;
  width: max-content;

  &.secondary {
    background-color: var(--primary-dark);
    color: var(--primary-light);
  }
`;

export const HeaderTag = styled.div`
  font-size: 11px;
  font-weight: 500;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 1px 15px;
  border-radius: 12px;
  width: max-content;

  &.secondary {
    background-color: var(--primary-dark);
    color: var(--primary-light);
  }
`;

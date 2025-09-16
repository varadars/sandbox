import styled from "styled-components";
import { HeaderTag } from "./Tag";

export const CardHeader = styled.div`
  width: max-content;
  justify-content: stretch;

  ${HeaderTag} {
  }
`;

export const CardTitle = styled.div`
  width: max-content;
  justify-content: stretch;

  ${HeaderTag} {
  }
`;

export const Card = styled.div`
  font-size: 14px;
  background-color: var(--accent-green);
  border: 2px solid var(--primary-dark);
  color: var(--primary-light);
  padding: 40px;
  width: max-content;
  position: relative;

  &.secondary {
    background-color: var(--primary-dark);
    color: var(--primary-light);
  }

  ${CardHeader} {
  }
  ${CardTitle} {
  }
  ${CardTags} {
  }
`;

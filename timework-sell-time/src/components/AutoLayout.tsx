import styled from "styled-components";

type AutoLayoutProps = {
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
};

const AutoLayout = styled.div<AutoLayoutProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  gap: ${({ gap }) =>
    gap !== undefined ? `${gap}px` : "0"};
  align-items: ${({ align }) => align || "center"};
  justify-content: ${({ justify }) => justify || "start"};
`;

export default AutoLayout;

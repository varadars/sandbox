import styled from "styled-components";

type AutoLayoutProps = {
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
};

export const AutoLayoutHorizontal = styled.div<AutoLayoutProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  gap: ${({ gap }) =>
    gap !== undefined ? `${gap}px` : "0"};
  align-items: ${({ align }) => align || "center"};
  justify-content: ${({ justify }) => justify || "start"};
`;

export const AutoLayoutVertical = styled.div<AutoLayoutProps>`
  display: flex;
  flex-direction: ${({ direction }) =>
    direction || "column"};
  gap: ${({ gap }) =>
    gap !== undefined ? `${gap}px` : "0"};
  align-items: ${({ align }) => align || "left"};
  justify-content: ${({ justify }) => justify || "start"};
`;

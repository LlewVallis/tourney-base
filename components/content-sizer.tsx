import { PropsWithChildren } from "react";
import styled from "styled-components";

export const CONTENT_SIZE = "60rem";
export const SMALL_CONTENT_SIZE = "40rem";

const Outer = styled.div`
  margin: 0 5vw;
`;

const Inner = styled.div`
  max-width: ${CONTENT_SIZE};
  margin: 0 auto;
`;

const ContentSizer = ({ children }: PropsWithChildren<{}>) => (
  <Outer>
    <Inner>{children}</Inner>
  </Outer>
);

export default ContentSizer;

export const SmallContent = styled.div`
  max-width: ${SMALL_CONTENT_SIZE};
  margin: 0 auto;
`;

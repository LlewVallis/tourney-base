import styled from "styled-components";
import { SMALL_CONTENT_SIZE } from "./content-sizer";

const CenterParagraph = styled.p`
  text-align: center;
  max-width: ${SMALL_CONTENT_SIZE};
  margin-left: auto;
  margin-right: auto;
`;

export default CenterParagraph;

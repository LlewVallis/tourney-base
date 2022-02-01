import styled from "styled-components";
import {
  BACKGROUND_COLOR_LIGHT,
  FOREGROUND_COLOR,
  PRIMARY_COLOR,
} from "../../lib/client/theme";

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${BACKGROUND_COLOR_LIGHT};
  padding: 0.5rem;
  border-left: 0.25rem solid ${PRIMARY_COLOR};
  border-radius: 0.25rem;
  margin: 0.25rem 0;
`;

export default Card;

export const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 105%;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  flex-basis: 5rem;
`;

export const CardButton = styled.button`
  color: ${FOREGROUND_COLOR};
  background-color: unset;
  border: none;
  cursor: pointer;

  &:hover {
    filter: brightness(85%);
  }
`;

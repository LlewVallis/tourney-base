import styled from "styled-components";
import { FOREGROUND_COLOR, FOREGROUND_COLOR_DARK } from "../lib/client/theme";

const Input = styled.input`
  width: 100%;
  height: 2rem;
  background-color: ${FOREGROUND_COLOR};
  border: 0.125rem solid ${FOREGROUND_COLOR_DARK};
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
`;

export default Input;

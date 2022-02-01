import styled from "styled-components";
import {
  DISABLED_COLOR,
  DISABLED_COLOR_DARK,
  ERROR_COLOR,
  ERROR_COLOR_DARK,
  FOREGROUND_COLOR,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SUCCESS_COLOR,
  SUCCESS_COLOR_DARK,
} from "../lib/client/theme";

const Button = ({
  color,
  colorDark,
}: {
  color: string;
  colorDark: string;
}) => styled.button`
  color: ${FOREGROUND_COLOR};
  background-color: ${color};
  font-weight: bold;
  border: 0.125rem solid ${colorDark};
  border-radius: 0.5rem;
  padding: 0.25rem 0.66rem;
  cursor: pointer;

  &:enabled:hover {
    filter: brightness(92.5%);
  }

  &:enabled:active {
    filter: brightness(87.5%);
  }

  &:disabled {
    background-color: ${DISABLED_COLOR};
    border-color: ${DISABLED_COLOR_DARK};
    cursor: unset;
  }
`;

export const ButtonPrimary = Button({
  color: PRIMARY_COLOR,
  colorDark: PRIMARY_COLOR_DARK,
});

export const ButtonSuccess = Button({
  color: SUCCESS_COLOR,
  colorDark: SUCCESS_COLOR_DARK,
});

export const ButtonError = Button({
  color: ERROR_COLOR,
  colorDark: ERROR_COLOR_DARK,
});

export const ButtonCancel = Button({
  color: DISABLED_COLOR,
  colorDark: DISABLED_COLOR_DARK,
});

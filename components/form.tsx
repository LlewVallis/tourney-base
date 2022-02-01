import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { ERROR_COLOR } from "../lib/client/theme";
import { ButtonSuccess } from "./button";
import Input from "./input";

const Form = styled.form`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1.5rem;
  row-gap: 1rem;
  align-items: center;
  margin-top: 2rem;
`;

export default Form;

const RequiredStar = styled.span`
  display: inline-block;
  color: ${ERROR_COLOR};
  width: 0.5rem;
  text-align: left;
`;

const Label = styled.label`
  font-weight: bold;
  text-align: right;
`;

export const Field = React.forwardRef<
  HTMLInputElement,
  PropsWithChildren<{
    pattern?: string;
    required?: boolean;
    defaultValue?: string;
  }>
>(function Field({ pattern, required, defaultValue, children }, ref) {
  return (
    <>
      <Label>
        {children} <RequiredStar>{required ? "*" : ""}</RequiredStar>
      </Label>
      <Input
        pattern={pattern}
        ref={ref}
        type="text"
        required={required}
        defaultValue={defaultValue}
      />
    </>
  );
});

export const FormFullWidth = styled.div`
  grid-column: span 2;
  width: 100%;
`;

const SubmitFormButton = styled(ButtonSuccess)`
  margin-top: 1rem;
  width: 100%;
`;

export const SubmitButton = ({
  children,
  disabled = false,
}: PropsWithChildren<{ disabled?: boolean }>) => (
  <FormFullWidth>
    <SubmitFormButton type="submit" disabled={disabled}>
      {children}
    </SubmitFormButton>
  </FormFullWidth>
);

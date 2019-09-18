import React from "react";
import styled from "styled-components";
import { Field, Form, StringMap, FormFieldErrorMap } from "@react-forms/core";
import { isRequired, isEmail } from "@react-forms/validations";

import CustomField from "./CustomField";

interface IRootProps {}

interface IRootState {}

const StyledField = styled(Field.Input)`
  font-family: Avenir;
`;

const StyledForm = styled(Form)`
  border: 1px solid black;
`;

export default class Root extends React.Component<IRootProps, IRootState> {
  onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    shouldSubmit: boolean,
    error: FormFieldErrorMap,
    fieldValues: StringMap
  ) => {
    if (shouldSubmit) {
      alert("Form looks good!");
    }
  };

  render() {
    return (
      <div>
        <h1>My Cool Form</h1>
        <StyledForm
          fields={{
            "first-name": {
              validations: {
                required: isRequired
              }
            },
            "last-name": {
              validations: {
                required: isRequired
              }
            },
            email: {
              validations: {
                required: isRequired,
                email: isEmail
              }
            },
            "favorite-color": {
              validations: {
                required: isRequired
              }
            },
            "custom-field": {
              validations: {
                required: isRequired
              }
            }
          }}
          formProps={{ action: "/", method: "post" }}
          onSubmit={this.onSubmit}
        >
          <StyledField
            name="first-name"
            label="First Name"
            initialValue="John"
            inputProps={{ placeholder: "Name" }}
          />
          <StyledField name="last-name" label="Last Name" />
          <CustomField name="custom-field" label="My Custom Field" />
          <StyledField name="email" label="Email" />
          <Field.Select
            name="favorite-color"
            label="Favorite Color"
            options={[
              { value: "blue", label: "Blue" },
              { value: "red", label: "Red" },
              { value: "yellow", label: "Yellow" }
            ]}
          />
          <Field.Submit text="Submit" />
        </StyledForm>
      </div>
    );
  }
}

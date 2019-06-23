import React from "react";
import styled from "styled-components";
import { Field, Form, StringMap, FormFieldErrorMap } from "@react-forms/core";
import { isRequired, isEmail } from "@react-forms/validations";

interface IRootProps {}

interface IRootState {}

const CustomField = styled(Field)`
  font-family: Avenir;
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
        <Form
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
            }
          }}
          formProps={{ action: "/", method: "post" }}
          onSubmit={this.onSubmit}>
          <CustomField name="first-name" label="First Name" />
          <CustomField name="last-name" label="Last Name" />
          <CustomField name="email" label="Email" />
          <input type="submit" value="Submit" />
        </Form>
      </div>
    );
  }
}

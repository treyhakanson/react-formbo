import React from "react";
import { Field, Form } from "@react-forms/core";
import { isRequired } from "@react-forms/validations";

interface IRootProps {}

interface IRootState {}

export default class Root extends React.Component<IRootProps, IRootState> {
  render() {
    return (
      <div>
        <h1>My Cool Form</h1>
        <Form
          fields={{
            name: {
              label: "Name",
              validations: [isRequired]
            }
          }}
          formElementProps={{ action: "/", method: "post" }}>
          <Field name="name" />
        </Form>
      </div>
    );
  }
}
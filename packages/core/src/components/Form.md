Simple synchronous validation form:

```js
import React from "react";

import { Field, Form } from "@react-forms/core";
import { isRequired, isEmail } from "@react-forms/validations";

<div>
  <h1>My Cool Form</h1>
  <Form
    fields={{
      "first-name": {
        label: "First Name",
        validations: [isRequired]
      },
      "middle-name": {
        label: "Middle Name",
        validations: []
      },
      "last-name": {
        label: "Last Name",
        validations: [isRequired]
      },
      email: {
        label: "Email",
        validations: [isRequired, isEmail]
      },
      "phone-number": {
        label: "Phone Number",
        validations: [isRequired, isPhone]
      }
    }}
    formElementProps={{ action: "/", method: "post" }}>
    <Field name="first-name" />
    <Field name="middle-name" />
    <Field name="last-name" />
    <Field name="email" />
  </Form>
</div>;
```

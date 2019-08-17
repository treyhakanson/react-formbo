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
        validations: {
          required: isRequired
        }
      },
      "middle-name": {
        label: "Middle Name",
        validations: {}
      },
      "last-name": {
        label: "Last Name",
        validations: {
          required: isRequired
        }
      },
      email: {
        label: "Email",
        validations: {
          required: isRequired,
          email: isEmail
        }
      },
      "phone-number": {
        label: "Phone Number",
        validations: {
          required: isRequired,
          phone: isPhone
        }
      }
    }}
    formProps={{ action: "/", method: "post" }}
  >
    <Field name="first-name" />
    <Field name="middle-name" />
    <Field name="last-name" />
    <Field name="email" />
  </Form>
</div>;
```

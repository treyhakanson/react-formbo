Simple synchronous validation form:

```js
import React from "react";

import { Field, Form } from "@react-formbo/core";
import { isRequired } from "@react-formbo/validations";

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
      }
    }}
    formElementProps={{ action: "/", method: "post" }}>
    <Field name="first-name" />
    <Field name="middle-name" />
    <Field name="last-name" />
  </Form>
</div>;
```

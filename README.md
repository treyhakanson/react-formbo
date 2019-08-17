⚠️ This project is under heavy development ⚠️

# React Forms

## Installation

To install:

```sh
yarn add @react-forms/core
# or
npm install --save @react-forms/core
```

## Overview

There's a lot of other form libraries out there. Most of them are bloated, unintutive, and overcomplicated. Some of them are even built around violating core design principles of the frameworks they work with (looking at you `redux-form`!). Forms used to be easy, and `react-forms` seeks to bring things back. React forms has:

- 🚀 Zero dependencies in the core
- 🤤 Dead simple API
- ⚡️ Lightning fast execution
- 🔧 Maximum extensibility

`react-forms` was built with good form design in mind, and will help you build better, more consistent forms in a fraction of the time.

## Documentaion

Component documentation and interactive examples can be found [here.](https://treyhakanson.github.io/react-forms)

### Add-Ons

- `@react-forms/validations`: some simple field validations to get you started

### A Simple Form

Creating a form with `react-forms` is dead simple:

```js
import React from "react";
import { Form, Field } from "@react-froms/core";
import { isRequired, isEmail } from "@react-forms/validations";

class MyCoolForm extends React.Component {
  onSubmit(event, shouldSubmit, errors, values) {
    if (shouldSubmit) {
      alert("Looks good to me!");
    }
  }

  render() {
    <Form
      fields={{
        "first-name": {
          validations: [isRequired]
        },
        "last-name": {
          validations: [isRequired]
        },
        email: {
          validations: [isRequired, isEmail]
        }
      }}
      formProps={{ action: "/", method: "post" }}
      onSubmit={this.onSubmit}
    >
      <Field.Input name="first-name" label="First Name" />
      <Field.Input name="last-name" label="Last Name" />
      <Field.Input name="email" label="Email" />
      <Field.Submit text="Submit" />
    </Form>;
  }
}
```

### Custom Fields

For convenience, `react-forms` provides a built-in `Field` component that is easily stylized and suitable for most use cases. However, there may be scenarios where it just doesn't cut it. Luckily, creating a custom field is easy! `react-forms` leverages React's new context API, so all you need to do is have your custom field subscribe to it. A helper has been provided for convenience:

```js
import * as React from "react";
import { withForm } from "@react-forms/core";

class MyCoolField extends React.Component {
  render() {
    const { errors, inputProps } = this.props;
    console.error(errors);
    return <input {...inputProps} />;
  }
}

export default withForm(MyCoolField);
```

See, easy! its **very important** to note that in the above example, the input element is given all attributes of `this.props.inputProps`. These props contain things like on change handlers and such that `react-forms` needs on its fields to function properly. Overriding attributes from `inputProps` is easy too though:

```js
import * as React from "react";
import { withForm } from "@react-forms/core";

class MyCoolField extends React.Component {
  _myCoolOnChangeMethod = value => {
    const { onChange } = this.props.inputProps;
    console.log("Look at me doing extra stuff 😎");
    onChange(value);
  };

  render() {
    const { inputProps, errors } = this.props;
    console.error(errors);
    return <input {...inputProps} onChange={this._myCoolOnChangeMethod} />;
  }
}

withForm(MyCoolField);
```

### Styling

`react-forms` is meant to handle your forms' logic, not their styling. However, `react-forms` maintains logical css class names so you can quickly style things using your favorite tools. The general structure of `react-forms` `Field` components are as follows:

```html
<div class="Field [Field--invalid]">
  <label className="Field__Label"></label>
  <input className="Field__Input" />
  <ul className="Field__ErrorList">
    <li className="Field__ErrorList__Error"></li>
  </ul>
</div>
```

`react-forms` also passes down css classnames, so you can CSS-in-JS libraries like `styled-components` to extend them. Here's an example of applying some quick styling:

```js
const MyCustomField = styled(Field)`
  // give the input a red border when invalid
  .Field--invalid .Field__Input {
    border: 1px solid red;
  }
`;
```

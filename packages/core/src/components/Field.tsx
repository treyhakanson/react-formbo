import React from "react";

import { FormContext } from "./Form";

interface IFieldProps {
  name: string;
}

export default class Field extends React.Component<IFieldProps> {
  static contextType = FormContext;

  render() {
    const { name } = this.props;
    const { label = "", ...inputProps } = this.context.fields[name] || {};
    const inputErrors: string[] = this.context.errors[name] || [];

    return (
      <div className="Field">
        {label && (
          <label className="Field__Label" htmlFor={name}>
            {label}
          </label>
        )}
        <input
          className="Field__Input"
          id={name}
          name={name}
          type="text"
          {...inputProps}
        />
        <ul className="Field__ErrorList">
          {inputErrors.map((error, i) => (
            <li className="Field__ErrorList__Error" key={i}>
              {error}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

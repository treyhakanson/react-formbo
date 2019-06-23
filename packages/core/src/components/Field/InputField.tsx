import React from "react";

import { IFormContext, StringMap } from "../Form";
import { IBaseInputFieldProps } from "./interfaces";
import BaseField from "./BaseField";

interface IInputFieldProps extends IBaseInputFieldProps {}

/** Field component */
export default class InputField extends BaseField<IInputFieldProps> {
  render() {
    const ctx = this.context as IFormContext;
    const {
      name,
      label = "",
      className = "",
      inputProps: additionalInputProps,
      ...props
    } = this.props;
    const inputProps = {
      ...ctx.fields[name],
      ...additionalInputProps
    };
    const inputErrors: StringMap = ctx.errors[name] || {};
    const invalid = !!Object.keys(inputErrors).length;

    return (
      <div className={this.getWrapperClassName(invalid, className)} {...props}>
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
          {Object.entries(inputErrors).map(([validationName, error], i) => (
            <li
              className="Field__ErrorList__Error"
              data-validation-name={validationName}
              key={validationName}>
              {error}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

import React from "react";

import { IFormContext, StringMap } from "../Form";
import { IBaseInputFieldProps } from "./types";
import BaseField from "./BaseField";
import Label from "./Label";
import ErrorList from "./ErrorList";

export interface IInputFieldProps extends IBaseInputFieldProps {}

/** Field component */
export default class InputField extends BaseField<IInputFieldProps> {
  render() {
    const ctx = this.context as IFormContext;
    const {
      name,
      label = "",
      className = "",
      inputProps: additionalInputProps,
      initialValue,
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
        <Label name={name} label={label} />
        <input
          className="Field__Input"
          id={name}
          name={name}
          type="text"
          {...inputProps}
        />
        <ErrorList errors={inputErrors} />
      </div>
    );
  }
}

import React from "react";

import { IFormContext, StringMap } from "../Form";
import { IBaseInputFieldProps } from "./types";
import BaseField from "./BaseField";
import ErrorList from "./ErrorList";
import Label from "./Label";

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldProps extends IBaseInputFieldProps {
  options: Array<ISelectOption>;
}

/** Field component */
export default class SelectField extends BaseField<ISelectFieldProps> {
  render() {
    const ctx = this.context as IFormContext;
    const {
      name,
      options,
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
        <Label name={name} label={label} />
        <select className="Field__Select" name={name} id={name} {...inputProps}>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ErrorList errors={inputErrors} />
      </div>
    );
  }
}

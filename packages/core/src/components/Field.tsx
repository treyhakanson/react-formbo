import React from "react";

import { IFormContext, StringMap, FormContext } from "./Form";

/** Field component props */
interface IFieldProps {
  name: string;
  label?: string;
  className?: string;
}

/** Field component */
export default class Field extends React.Component<IFieldProps> {
  static contextType = FormContext;

  componentDidMount() {
    const { name } = this.props;
    const ctx = this.context as IFormContext;
    if (!ctx.fields[name]) {
      throw new Error(
        `field with name "${name}" has no corresponding entry in a parent form.`
      );
    }
  }

  /**
   * Get the classname for the field's wrapper
   *
   * @param invalid whether or not the field is invalid
   * @param additionalClassName additional className to use for the field
   */
  private getWrapperClassName(
    invalid: boolean,
    additionalClassName: string
  ): string {
    let classNames = ["Field"];
    if (invalid) {
      classNames.push("Field--invalid");
    }
    if (additionalClassName) {
      classNames.push(additionalClassName);
    }
    return classNames.join(" ");
  }

  render() {
    const ctx = this.context as IFormContext;
    const { name, label = "", className = "", ...props } = this.props;
    const inputProps = ctx.fields[name];
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

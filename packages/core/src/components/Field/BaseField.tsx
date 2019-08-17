import React from "react";

import { IFormContext, FormContext } from "../Form";
import { IBaseInputFieldProps } from "./types";

export default abstract class BaseField<
  Props extends IBaseInputFieldProps,
  State = {}
> extends React.Component<Props, State> {
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
  protected getWrapperClassName(
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
}

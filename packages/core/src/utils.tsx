import React from "react";
import Field from "./components/Field";
import { IBaseInputFieldProps } from "./components/Field/types";
import { StringMap } from "./components";

export type IWrapperComponentProps = IBaseInputFieldProps;
export interface IEnhancedComponentProps extends IBaseInputFieldProps {
  errors: StringMap;
}

export function withForm(
  WrappedComponent: React.ComponentClass<IEnhancedComponentProps, any>
): React.ComponentClass<IBaseInputFieldProps> {
  class WrapperComponent extends Field.Base<IBaseInputFieldProps> {
    render() {
      const { name, ...props } = this.props;
      const fieldProps = this.context.fields[name];
      const errors = this.context.errors[name];

      return (
        <WrappedComponent
          name={name}
          errors={errors}
          inputProps={fieldProps}
          {...props}
        />
      );
    }
  }
  return WrapperComponent;
}

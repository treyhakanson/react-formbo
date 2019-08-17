import React from "react";
import Field from "./components/Field";
import { IBaseInputFieldProps } from "./components/Field/interfaces";

type IComponentProps = any & IBaseInputFieldProps;

export function withForm(
  WrappedComponent: React.ComponentClass<IComponentProps, any>
): React.ComponentClass<IComponentProps, any> {
  class WrapperComponent extends Field.Base<IComponentProps, any> {
    render() {
      const { name, ...props } = this.props;
      const fieldProps = this.context.fields[name];
      const errors = this.context.errors[name];
      return (
        <WrappedComponent
          errors={errors}
          {...fieldProps.inputProps}
          {...props}
        />
      );
    }
  }
  return WrapperComponent;
}

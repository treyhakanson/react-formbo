import React from "react";

import { ValidationFunction } from "../validation";

type OnChangeFunction = (event: React.FormEvent<HTMLInputElement>) => void;
type ErrorMap = { [key: string]: { [key: string]: Array<string> } };

interface IFieldProps {
  name: string;
  label?: string;
  onChange: OnChangeFunction;
}

interface IFormProps {
  fields: {
    [key: string]: {
      label: string;
      validations: Array<ValidationFunction>;
    };
  };
  formElementProps: { [key: string]: any };
}

interface IFormState {
  errors: ErrorMap;
}

export const FormContext = React.createContext({
  fields: {},
  errors: {}
});

function buildOnChange(
  validations: Array<ValidationFunction>,
  updateErrors: (name: string, errors: Array<string>) => void
): OnChangeFunction {
  return async (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value }
    } = event;
    const errors: Array<string> = (await Promise.all(
      validations.map(async validation => {
        const error = validation(value);
        if (error && typeof error === "string") {
          // sync validation
          return error;
        } else if (error) {
          // async validation
          try {
            await validation(value);
          } catch (message) {
            return message;
          }
        }
      })
    )).filter((error: string | null) => !!error);
    updateErrors(name, errors);
  };
}

export default class Form extends React.Component<IFormProps, IFormState> {
  static defaultProps = {
    fields: {},
    formElementProps: {}
  };

  readonly state = {
    errors: {}
  };

  private updateErrors = (name: string, errors: Array<string>) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [name]: errors
      }
    });
  };

  private createFieldProps = (): {
    [key: string]: IFieldProps;
  } => {
    const { fields } = this.props;
    let fieldProps: {
      [key: string]: IFieldProps;
    } = {};
    for (let [fieldName, { validations, label }] of Object.entries(fields)) {
      fieldProps[fieldName] = {
        label,
        name: fieldName,
        onChange: buildOnChange(validations, this.updateErrors)
      };
    }
    return fieldProps;
  };

  render() {
    const { formElementProps, children } = this.props;
    const { errors } = this.state;
    const fieldProps = this.createFieldProps();

    return (
      <FormContext.Provider value={{ fields: fieldProps, errors: errors }}>
        <form {...formElementProps}>{children}</form>
      </FormContext.Provider>
    );
  }
}

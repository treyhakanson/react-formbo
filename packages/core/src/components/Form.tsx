import React from "react";

import { ValidationFunction } from "../validation";

/** Basic string map (string keys, values) */
export type StringMap = { [key: string]: string };
/** Form event callback function (onChange, onBlur, etc.) */
export type FormEventCallback = (event: any) => void;
/** Form error map for fields (field name is key) */
export type FormFieldErrorMap = { [key: string]: StringMap };
/** Form field metadata map for fields (field name is key) */
export type FormFieldMetaMap = { [key: string]: IFormFieldMeta };
/** Form additional props map for fields (field name is key) */
export type FormFieldPropsMap = { [key: string]: IFormFieldProps };

/** Form props */
export interface IFormProps {
  fields: {
    [key: string]: {
      validations: { [key: string]: ValidationFunction };
    };
  };
  formProps: { [key: string]: any };
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    shouldSubmit: boolean,
    errors: FormFieldErrorMap,
    values: StringMap
  ) => void;
  className?: string;
}

/** Form context */
export interface IFormContext {
  /** Form field information */
  fields: { [key: string]: IFormFieldProps };
  /** Props to pass to the top-level form element */
  errors: FormFieldErrorMap;
  /** Form state information */
  formState: {
    submitting: boolean;
  };
}

/** Form field props for initializing form component */
export interface IFormFieldProps {
  value: string;
  onChange: FormEventCallback;
  onBlur: FormEventCallback;
}

/** Form state */
export interface IFormState {
  /** Whether or not the form is submitting */
  isSubmitting: boolean;
  /** Field errors */
  errors: FormFieldErrorMap;
  /** Additional props to provide to fields */
  fieldValues: StringMap;
  /** Field metadata */
  fieldMeta: FormFieldMetaMap;
}

/** Form field metadata */
export interface IFormFieldMeta {
  touched: boolean;
}

/** Initialized form context to be provided to fields */
export const FormContext = React.createContext<Partial<IFormContext>>({
  fields: {},
  errors: {},
  formState: {
    submitting: false
  }
});

/**
 * Default form field metadata
 */
function getDefaultFieldMeta(): IFormFieldMeta {
  return {
    touched: false
  };
}

/** Form component */
export default class Form extends React.Component<IFormProps, IFormState> {
  static defaultProps = {
    fields: {},
    formProps: {}
  };

  readonly state: IFormState;

  constructor(props: IFormProps) {
    super(props);
    let fieldMeta: FormFieldMetaMap = {};
    let errors: FormFieldErrorMap = {};
    Object.keys(props.fields).forEach(fieldName => {
      fieldMeta[fieldName] = getDefaultFieldMeta();
      errors[fieldName] = {};
      return fieldMeta;
    });
    this.state = {
      isSubmitting: false,
      errors,
      fieldValues: {},
      fieldMeta
    };
  }

  /**
   * Update errors for a given field
   *
   * @param name the name of the field
   * @param errors the field's errors
   */
  private updateErrors = (name: string, errors: StringMap) => {
    this.setState({
      errors: {
        ...this.state.errors,
        [name]: errors
      }
    });
  };

  /**
   * Validate a field based on its value
   *
   * @param fieldName the name of the field
   * @param value the value of the field
   */
  private validateField = async (fieldName: string, value: string) => {
    const { fields } = this.props;
    const { validations } = fields[fieldName];
    return await Object.entries(validations).reduce(
      async (errors: StringMap, [validationName, validation]) => {
        errors = await errors;
        const error = validation(value);
        if (error && typeof error === "string") {
          // sync validation
          errors[validationName] = error;
        } else if (error) {
          // async validation
          try {
            await validation(value);
          } catch (message) {
            errors[validationName] = message;
          }
        }
        return errors;
      },
      {}
    );
  };

  /**
   * Generic on blur method for a field
   *
   * @param event the blur event
   */
  private onFieldBlur: FormEventCallback = async event => {
    const {
      currentTarget: { name, value }
    } = event;
    const { fieldMeta } = this.state;
    const meta = fieldMeta[name];
    if (!meta.touched) {
      this.setState({
        fieldMeta: {
          ...fieldMeta,
          [name]: { ...meta, touched: true }
        }
      });
      const errors = await this.validateField(name, value);
      this.updateErrors(name, errors);
    }
  };

  private updateFieldValue(name: string, value: string) {
    this.setState({
      fieldValues: {
        ...this.state.fieldValues,
        [name]: value
      }
    });
  }

  /**
   * Generic on change method for a field
   *
   * @param event the on change event
   */
  private onFieldChange: FormEventCallback = async event => {
    const {
      currentTarget: { name, value }
    } = event;
    const errors = await this.validateField(name, value);
    this.updateFieldValue(name, value);
    this.updateErrors(name, errors);
  };

  /**
   * Create the field props for the indivdual field components
   */
  private createFieldProps = (): {
    [key: string]: IFormFieldProps;
  } => {
    const { fields } = this.props;
    const { fieldValues } = this.state;
    let fieldProps: FormFieldPropsMap = {};
    for (let fieldName of Object.keys(fields)) {
      fieldProps[fieldName] = {
        value: fieldValues[fieldName] || "",
        onBlur: this.onFieldBlur,
        onChange: this.onFieldChange
      };
    }
    return fieldProps;
  };

  /**
   * On submit method for the form
   *
   * @param event the submission event
   */
  private onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onSubmit } = this.props;
    const { errors, fieldMeta, fieldValues } = this.state;
    let allErrors = { ...errors };
    for (let [fieldName, meta] of Object.entries(fieldMeta)) {
      if (!meta.touched) {
        const fieldValue = fieldValues[fieldName] || "";
        const errors = await this.validateField(fieldName, fieldValue);
        allErrors[fieldName] = errors;
      }
    }
    const shouldSubmit =
      Object.values(allErrors).reduce(
        (sum, errors) => sum + Object.values(errors).length,
        0
      ) === 0;
    onSubmit(event, shouldSubmit, allErrors, fieldValues);
    this.setState({ errors: allErrors });
  };

  private getFormState = () => {
    const { isSubmitting } = this.state;
    return { submitting: isSubmitting };
  };

  private getFormClassname = (): string => {
    const { className } = this.props;
    let classNames = ["ReactForm"];
    if (className) {
      classNames.push(className);
    }
    return classNames.join(" ");
  };

  render() {
    const { formProps, children } = this.props;
    const { errors } = this.state;
    const fieldProps = this.createFieldProps();
    const formState = this.getFormState();
    const className = this.getFormClassname();

    return (
      <FormContext.Provider value={{ fields: fieldProps, errors, formState }}>
        <form {...formProps} className={className} onSubmit={this.onFormSubmit}>
          {children}
        </form>
      </FormContext.Provider>
    );
  }
}

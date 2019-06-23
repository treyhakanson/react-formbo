import React from "react";

import { ValidationFunction } from "../validation";

/** Basic string map (string keys, values) */
export type StringMap = { [key: string]: string };
/** Form on change function */
type OnChangeFunction = (event: React.FormEvent<HTMLInputElement>) => void;
/** Form on blur function */
type OnBlurFunction = (event: React.FormEvent<HTMLInputElement>) => void;
/** Form error map for fields (field name is key) */
export type FormFieldErrorMap = { [key: string]: StringMap };
/** Form field metadata map for fields (field name is key) */
type FormFieldMetaMap = { [key: string]: IFormFieldMeta };
/** Form additional props map for fields (field name is key) */
type FormFieldPropsMap = { [key: string]: IFormFieldProps };

/** Form props */
interface IFormProps {
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
}

/** Form context */
export interface IFormContext {
  fields: { [key: string]: IFormFieldProps };
  errors: FormFieldErrorMap;
  formState: {
    submitting: boolean;
  };
}

/** Form field props for initializing form component */
interface IFormFieldProps {
  value: string;
  onChange: OnChangeFunction;
  onBlur: OnBlurFunction;
}

/** Form state */
interface IFormState {
  isSubmitting: boolean;
  errors: FormFieldErrorMap;
  fieldValues: StringMap;
  fieldMeta: FormFieldMetaMap;
}

/** Form field metadata */
interface IFormFieldMeta {
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
    /** Form field information */
    fields: {},
    /** Props to pass to the top-level form element */
    formProps: {}
  };

  readonly state: IFormState = {
    /** Whether or not the form is submitting */
    isSubmitting: false,
    /** Field errors */
    errors: {},
    /** Additional props to provide to fields */
    fieldValues: {},
    /** Field metadata */
    fieldMeta: {}
  };

  componentDidMount() {
    const { fields } = this.props;
    const fieldMeta = Object.keys(fields).reduce(
      (fieldMeta: FormFieldMetaMap, fieldName) => {
        fieldMeta[fieldName] = getDefaultFieldMeta();
        return fieldMeta;
      },
      {}
    );
    this.setState({ fieldMeta });
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
  private onFieldBlur = async (event: React.FormEvent<HTMLInputElement>) => {
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
  private onFieldChange = async (event: React.FormEvent<HTMLInputElement>) => {
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

  render() {
    const { formProps, children } = this.props;
    const { errors } = this.state;
    const fieldProps = this.createFieldProps();
    const formState = this.getFormState();

    return (
      <FormContext.Provider value={{ fields: fieldProps, errors, formState }}>
        <form {...formProps} onSubmit={this.onFormSubmit}>
          {children}
        </form>
      </FormContext.Provider>
    );
  }
}

import React from "react";
import styled from "styled-components";
import { withForm, IBaseInputFieldProps, StringMap } from "@react-forms/core";

export interface ICustomFieldProps extends IBaseInputFieldProps {
  errors: StringMap;
}

const CustomFieldWrapper = styled.div`
  .CustomField__Label {
    color: blue;
  }

  .CustomField__Errors {
    border: 2px solid red;
    background-color: rgba(255, 0, 0, 0.15);
    color: red;
    padding: 15px;
  }
`;

class CustomField extends React.Component<ICustomFieldProps> {
  render() {
    const { label, name, inputProps, errors, ...props } = this.props;

    return (
      <CustomFieldWrapper>
        <label className="CustomField__Label" htmlFor={name}>
          {label}
        </label>
        <input id={name} name={name} {...inputProps} {...props} />
        {!!Object.keys(errors).length && (
          <pre className="CustomField__Errors">{JSON.stringify(errors)}</pre>
        )}
      </CustomFieldWrapper>
    );
  }
}

export default withForm(CustomField);

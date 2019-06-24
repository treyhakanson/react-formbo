import React from "react";
import { StringMap } from "../Form";

export interface IErrorListProps {
  errors: StringMap;
}

const ErrorList: React.SFC<IErrorListProps> = ({ errors }) => (
  <ul className="Field__ErrorList">
    {Object.entries(errors).map(([validationName, error], i) => (
      <li
        className="Field__ErrorList__Error"
        data-validation-name={validationName}
        key={validationName}>
        {error}
      </li>
    ))}
  </ul>
);

export default ErrorList;

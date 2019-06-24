import React from "react";

export interface ILabelProps {
  name: string;
  label: string;
}

const Label: React.SFC<ILabelProps> = ({ name, label }) => (
  <React.Fragment>
    {label &&
      ((
        <label className="Field__Label" htmlFor={name}>
          {label}
        </label>
      ) ||
        null)}
  </React.Fragment>
);

export default Label;

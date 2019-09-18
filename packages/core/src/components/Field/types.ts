/** Field component props */
export interface IBaseFieldProps {
  className?: string;
  inputProps?: object;
  initialValue?: string;
}

export interface IBaseInputFieldProps extends IBaseFieldProps {
  name: string;
  label?: string;
}

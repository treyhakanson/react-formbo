/** Field component props */
export interface IBaseFieldProps {
  className?: string;
  inputProps?: object;
}

export interface IBaseInputFieldProps extends IBaseFieldProps {
  name: string;
  label?: string;
}

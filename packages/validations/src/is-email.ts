import isValidEmail from "is-email";

const DEFAULT_ERROR = "This field must be an email";

export const buildIsEmail = (error: string) => {
  return (value: string) => {
    if (value && !isValidEmail(value)) {
      return error;
    }
  };
};

export const isEmail = buildIsEmail(DEFAULT_ERROR);

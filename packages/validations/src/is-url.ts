import isValidUrl from "is-url";

const DEFAULT_ERROR = "This field must be an email";

export const buildIsUrl = (error: string) => {
  return (value: string) => {
    if (value && !isValidUrl(value)) {
      return error;
    }
  };
};

export const isUrl = buildIsUrl(DEFAULT_ERROR);

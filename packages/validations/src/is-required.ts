const DEFAULT_ERROR = "This field is required";

export const buildIsRequired = (error: string) => {
  return (value: string) => {
    if (!value) {
      return error;
    }
  };
};

export const isRequired = buildIsRequired(DEFAULT_ERROR);

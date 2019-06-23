export type SyncValidationFunction = (value: string) => string | undefined;
export type AsyncValidationFunction = (
  value: string
) => Promise<string | undefined>;
export type ValidationFunction =
  | SyncValidationFunction
  | AsyncValidationFunction;

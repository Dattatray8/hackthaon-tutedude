export type HelperResponse<T = unknown> = {
  data: T | null;
  error: {
    message: string;
  } | null;
};
import axios from "axios";

export function getErrorMessage(error: unknown, fallback = "An unknown error occurred."): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "An error occurred during the request."
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
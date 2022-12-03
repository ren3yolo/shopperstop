export interface CustomError extends Error {
  response?: {
    data?: {
      message: string;
    };
  };
  message: string;
}

function getError<T extends CustomError>(err: T): string {
  return err.response?.data?.message ? err.response.data.message : err.message;
}

export { getError };

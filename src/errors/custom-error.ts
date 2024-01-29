export abstract class CustomError extends Error implements ICustomError {
  abstract httpCode: number;
  abstract serialize(): IError;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export interface ICustomError {
  httpCode: number;
  serialize(): IError;
}

export interface IError {
  httpCode: number;
  message?: string;
  errors?: Array<{
    message?: string;
    field?: string;
    value?: string | number | boolean;
    constraints?: { [key: string]: string };
  }>;
}

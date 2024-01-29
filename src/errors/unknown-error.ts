import { CustomError, IError } from "./custom-error";

export class UnknownError extends CustomError {
  public httpCode = 500;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }

  public serialize(): IError {
    return {
      httpCode: this.httpCode,
      message: this.message
    };
  }
}

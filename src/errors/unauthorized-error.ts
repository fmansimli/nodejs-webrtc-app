import { CustomError, IError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  public httpCode = 401;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public serialize(): IError {
    return {
      httpCode: this.httpCode,
      message: this.message
    };
  }
}

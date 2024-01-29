import { CustomError, IError } from "./custom-error";

export class BadRequestError extends CustomError {
  public httpCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public serialize(): IError {
    return {
      httpCode: this.httpCode,
      message: this.message
    };
  }
}

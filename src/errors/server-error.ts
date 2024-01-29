import { CustomError, IError } from "./custom-error";

export class ServerError extends CustomError {
  public httpCode = 500;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ServerError.prototype);
  }

  public serialize(): IError {
    return {
      httpCode: this.httpCode,
      message: this.message
    };
  }
}

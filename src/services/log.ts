export class Logger {
  static error(error: any) {
    console.error("CUSTOM_LOGGER:", error);
  }

  static log(data: any) {
    console.log("CUSTOM_LOGGER:", data);
  }
}

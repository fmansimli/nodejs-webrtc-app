import { verify, sign, decode } from "jsonwebtoken";

export class Jwt {
  static async verifyAsync(token: string) {
    return verify(token, process.env.JWT_SECRET as string);
  }

  static async signAsync(payload: any) {
    return sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  }

  static async signKey(payload: any) {
    return sign(payload, process.env.JWT_SECRET as string, { expiresIn: "420d" });
  }

  static async unpack(token: string) {
    return decode(token);
  }
}

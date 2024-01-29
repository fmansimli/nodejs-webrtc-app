import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string, level = 10): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(password, salt, level)) as Buffer;
    return `${buffer.toString("hex")}.${salt}.${level}`;
  }

  static async compare(stored: string, plain: string): Promise<boolean> {
    const [hashed, salt, level] = stored.split(".");
    const buffer = (await scryptAsync(plain, salt, +level)) as Buffer;

    return buffer.toString("hex") === hashed;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_HOST_URL: string;
      JWT_SECRET: string;
    }
  }
}
export {};

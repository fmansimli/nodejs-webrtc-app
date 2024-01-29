import http from "http";
import app from "./app";

import * as AppSocket from "./sockets/socket";
import { Logger } from "./services/log";

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 6007;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

async function bootstrap() {
  try {
    httpServer.listen(PORT, () => {
      AppSocket.initialize(httpServer);
      Logger.log("**** listening on port " + PORT);
    });
  } catch (error) {
    Logger.error(error);
  }
}

bootstrap();

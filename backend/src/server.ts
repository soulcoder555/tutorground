import http from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { initSocket } from "./socket";

const app = createApp();
const server = http.createServer(app);
initSocket(server);

server.listen(env.PORT, () => {
  console.log(`TutorGround API listening on port ${env.PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});


import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { apiRateLimit } from "./middleware/rateLimit";
import { sanitizeRequest } from "./middleware/sanitize";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { tutorsRouter } from "./routes/tutors";
import { studentsRouter } from "./routes/students";
import { parentsRouter } from "./routes/parents";
import { sessionsRouter } from "./routes/sessions";
import { attendanceRouter } from "./routes/attendance";
import { homeworkRouter } from "./routes/homework";
import { proofCardsRouter } from "./routes/proofCards";
import { reviewsRouter } from "./routes/reviews";
import { notificationsRouter } from "./routes/notifications";
import { searchRouter } from "./routes/search";
import { adminRouter } from "./routes/admin";
import { bookingsRouter } from "./routes/bookings";
import { paymentsRouter } from "./routes/payments";

export function createApp() {
  const app = express();
  const allowedOrigins = new Set([env.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"]);

  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error("Origin not allowed by TutorGround CORS"));
      },
      credentials: true
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeRequest);
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/health", (_req, res) => {
    res.json({ data: { status: "ok", service: "tutorground-api", timestamp: new Date().toISOString() } });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/search", apiRateLimit, searchRouter);
  app.use("/api/tutors", apiRateLimit, tutorsRouter);
  app.use("/api/students", apiRateLimit, studentsRouter);
  app.use("/api/parents", apiRateLimit, parentsRouter);
  app.use("/api/sessions", apiRateLimit, sessionsRouter);
  app.use("/api/attendance", apiRateLimit, attendanceRouter);
  app.use("/api/homework", apiRateLimit, homeworkRouter);
  app.use("/api/proof-cards", apiRateLimit, proofCardsRouter);
  app.use("/api/reviews", apiRateLimit, reviewsRouter);
  app.use("/api/notifications", apiRateLimit, notificationsRouter);
  app.use("/api/bookings", apiRateLimit, bookingsRouter);
  app.use("/api/admin", apiRateLimit, adminRouter);
  app.use("/api/payments", apiRateLimit, paymentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

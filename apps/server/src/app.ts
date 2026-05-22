import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import {
  authenticate
} from "./middleware/auth.middleware";
import workspaceRoutes from "./modules/workspace/workspace.routes";
import messageRoutes from "./modules/message/message.routes";
import uploadRoutes from "./modules/upload/upload.routes";
import presenceRoutes from "./modules/presence/presence.routes";
import documentRoutes from "./modules/document/document.routes";
import activityRoutes from "./modules/activity/activity.routes";
import searchRoutes from "./modules/search/search.routes";
import aiRoutes from "./modules/ai/ai.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import permissionRoutes from "./modules/permissions/permissions.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "50mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);

app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "Server running successfully"
  });
});

app.get(
  "/api/protected",
  authenticate,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route accessed"
    });
  }
);

app.use(
  "/api/workspaces",
  workspaceRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/uploads",
  uploadRoutes
);

app.use(
  "/api/presence",
  presenceRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/activity",
  activityRoutes
);

app.use(
  "/api/search",
  searchRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/permissions",
  permissionRoutes
);

export default app;

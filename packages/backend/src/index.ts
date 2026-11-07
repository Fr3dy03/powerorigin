import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";

import sitesRouter from "./routes/sites";
import metersRouter from "./routes/meters";
import readingsRouter from "./routes/readings";
import claimsRouter from "./routes/claims";
import certificatesRouter from "./routes/certificates";
import auditsRouter from "./routes/audits";
import reportsRouter from "./routes/reports";
import authRouter from "./routes/auth";
import integrationsRouter from "./routes/integrations";

export const prisma = new PrismaClient();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "powerorigin-backend" }));

app.use("/api/auth", authRouter);
app.use("/api/sites", sitesRouter);
app.use("/api/meters", metersRouter);
app.use("/api/readings", readingsRouter);
app.use("/api/claims", claimsRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/audits", auditsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/integrations", integrationsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`PowerOrigin backend listening on ${port}`);
});

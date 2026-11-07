import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

// List readings for a site/meter in a window
router.get("/", async (req, res) => {
  const { siteId, meterId, from, to } = req.query as any;
  const where: any = {};
  if (siteId) where.siteId = siteId;
  if (meterId) where.meterId = meterId;
  if (from || to) where.timestamp = {};
  if (from) where.timestamp.gte = new Date(from);
  if (to) where.timestamp.lte = new Date(to);
  const readings = await prisma.intervalReading.findMany({ where, orderBy: { timestamp: "asc" } });
  res.json(readings);
});

// Ingest a batch of readings (idempotent upsert by meterId+timestamp)
router.post("/ingest", requireRole("admin", "operator"), async (req: AuthRequest, res) => {
  const { meterId, readings } = req.body as { meterId: string; readings: { timestamp: string; kWh: number; quality?: string; source?: string }[] };
  if (!meterId || !Array.isArray(readings)) return res.status(400).json({ error: "invalid payload" });
  const meter = await prisma.meter.findUnique({ where: { id: meterId } });
  if (!meter) return res.status(404).json({ error: "meter not found" });

  const results: { inserted: number; duplicates: number; invalid: string[] } = { inserted: 0, duplicates: 0, invalid: [] };
  for (const r of readings) {
    const ts = new Date(r.timestamp);
    if (isNaN(ts.getTime())) { results.invalid.push(`bad timestamp: ${r.timestamp}`); continue; }
    if (typeof r.kWh !== "number" || r.kWh < 0) { results.invalid.push(`bad kWh: ${r.kWh}`); continue; }
    try {
      await prisma.intervalReading.create({
        data: { meterId, siteId: meter.siteId, timestamp: ts, kWh: r.kWh, quality: r.quality || "measured", source: r.source || "api" },
      });
      results.inserted++;
    } catch (e: any) {
      if (e?.code === "P2002") results.duplicates++;
      else results.invalid.push(e?.message || "unknown error");
    }
  }
  // update meter last reading
  const last = readings.length ? new Date(readings[readings.length - 1].timestamp) : null;
  if (last) await prisma.meter.update({ where: { id: meterId }, data: { lastReadingAt: last, status: "connected" } });
  res.json(results);
});

// Reconcile missing intervals for a meter in a window
router.get("/gaps", async (req, res) => {
  const { meterId, from, to } = req.query as any;
  if (!meterId || !from || !to) return res.status(400).json({ error: "meterId, from, to required" });
  const meter = await prisma.meter.findUnique({ where: { id: meterId } });
  if (!meter) return res.status(404).json({ error: "meter not found" });
  const readings = await prisma.intervalReading.findMany({
    where: { meterId, timestamp: { gte: new Date(from), lte: new Date(to) } },
    orderBy: { timestamp: "asc" },
  });
  const step = meter.intervalMinutes * 60 * 1000;
  const gaps: { start: string; end: string }[] = [];
  let cursor = new Date(from).getTime();
  const end = new Date(to).getTime();
  const set = new Set(readings.map((r) => r.timestamp.getTime()));
  while (cursor <= end) {
    if (!set.has(cursor)) {
      const gStart = cursor;
      while (cursor <= end && !set.has(cursor)) cursor += step;
      gaps.push({ start: new Date(gStart).toISOString(), end: new Date(cursor - step).toISOString() });
    } else {
      cursor += step;
    }
  }
  res.json({ meterId, from, to, intervalMinutes: meter.intervalMinutes, gapCount: gaps.length, gaps });
});

export default router;

import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

// Ingest grid intensity data (hourly). Caller must supply hourly values; annual averages are rejected for hourly evidence.
router.post("/grid", requireRole("admin", "operator"), async (req, res) => {
  const { siteId, values } = req.body as { siteId: string; values: { timestamp: string; gCo2PerKWh: number; source?: string; resolution?: string }[] };
  if (!siteId || !Array.isArray(values)) return res.status(400).json({ error: "invalid payload" });
  let inserted = 0;
  for (const v of values) {
    const resolution = v.resolution || "hourly";
    if (resolution !== "hourly") return res.status(400).json({ error: "only hourly grid data may be stored as interval evidence" });
    try {
      await prisma.gridIntensity.create({ data: { siteId, timestamp: new Date(v.timestamp), gCo2PerKWh: v.gCo2PerKWh, source: v.source || "electricitymaps", resolution } });
      inserted++;
    } catch (e: any) {
      if (e?.code !== "P2002") throw e;
    }
  }
  res.json({ inserted });
});

router.get("/grid", async (req, res) => {
  const { siteId, from, to } = req.query as any;
  const data = await prisma.gridIntensity.findMany({
    where: { siteId, timestamp: { gte: new Date(from), lte: new Date(to) } },
    orderBy: { timestamp: "asc" },
  });
  res.json(data);
});

// Proxy-ish placeholder: returns guidance for Electricity Maps (requires API key)
router.get("/electricitymaps/status", async (_req, res) => {
  res.json({ configured: !!process.env.ELECTRICITYMAPS_API_KEY, note: "Commercial terms and geography must be verified before production use." });
});

export default router;

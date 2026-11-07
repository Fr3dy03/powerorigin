import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

// GET /api/reports/site/:siteId?from=&to=
router.get("/site/:siteId", async (req, res) => {
  const { siteId } = req.params;
  const { from, to } = req.query as { from?: string; to?: string };

  const where: any = {};
  if (siteId) where.siteId = siteId;
  if (from || to) where.timestamp = {};
  if (from) where.timestamp.gte = new Date(from);
  if (to) where.timestamp.lte = new Date(to);

  try {
    const readings = await prisma.intervalReading.findMany({
      where,
      orderBy: { timestamp: "asc" },
      include: {
        meter: {
          include: { site: true },
        },
      },
    });

    // Get grid intensity data for this site and window
    const gridWhere: any = { siteId };
    if (from || to) {
      gridWhere.timestamp = {};
      if (from) gridWhere.timestamp.gte = new Date(from);
      if (to) gridWhere.timestamp.lte = new Date(to);
    }
    const gridData = await prisma.gridIntensity.findMany({
      where: gridWhere,
      orderBy: { timestamp: "asc" },
    });

    // Get all certificates (no direct site link in Prisma; filter client-side if needed)
    const allCerts = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Calculate summary from readings
    const totalConsumption = readings.reduce(
      (sum: number, r: { kWh: number }) => sum + r.kWh,
      0
    );

    const summary = {
      totalConsumption,
      readingCount: readings.length,
      gridIntensityCount: gridData.length,
      certificateCount: allCerts.length,
    };

    res.json({ summary, readings, gridData, certificates: allCerts });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
});

export default router;
import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const siteId = req.query.siteId as string | undefined;
  const meters = await prisma.meter.findMany({ where: siteId ? { siteId } : undefined });
  res.json(meters);
});

router.post("/", requireRole("admin", "operator"), async (req: AuthRequest, res) => {
  const { siteId, vendor, externalId, intervalMinutes, unit } = req.body;
  const meter = await prisma.meter.create({ data: { siteId, vendor, externalId, intervalMinutes: intervalMinutes || 60, unit: unit || "kWh" } });
  res.status(201).json(meter);
});

router.get("/:id", async (req, res) => {
  const meter = await prisma.meter.findUnique({ where: { id: req.params.id } });
  if (!meter) return res.status(404).json({ error: "not found" });
  res.json(meter);
});

router.patch("/:id", requireRole("admin", "operator"), async (req, res) => {
  const meter = await prisma.meter.update({ where: { id: req.params.id }, data: req.body });
  res.json(meter);
});

router.post("/:id/health", async (req, res) => {
  const meter = await prisma.meter.findUnique({ where: { id: req.params.id } });
  if (!meter) return res.status(404).json({ error: "not found" });
  res.json({ id: meter.id, status: meter.status, lastReadingAt: meter.lastReadingAt });
});

export default router;

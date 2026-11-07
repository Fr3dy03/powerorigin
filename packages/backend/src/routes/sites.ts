import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (_req, res) => {
  const sites = await prisma.site.findMany({ include: { meters: true } });
  res.json(sites);
});

router.post("/", requireRole("admin", "operator"), async (req: AuthRequest, res) => {
  const { facilityId, operator, region, gridZone, reportingStart, reportingEnd } = req.body;
  const site = await prisma.site.create({
    data: { facilityId, operator, region, gridZone, reportingStart: new Date(reportingStart), reportingEnd: new Date(reportingEnd) },
  });
  res.status(201).json(site);
});

router.get("/:id", async (req, res) => {
  const site = await prisma.site.findUnique({ where: { id: req.params.id }, include: { meters: true, claims: true } });
  if (!site) return res.status(404).json({ error: "not found" });
  res.json(site);
});

router.patch("/:id", requireRole("admin", "operator"), async (req, res) => {
  const site = await prisma.site.update({ where: { id: req.params.id }, data: req.body });
  res.json(site);
});

export default router;

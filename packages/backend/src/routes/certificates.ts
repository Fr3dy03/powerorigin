import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const certs = await prisma.certificate.findMany({ orderBy: { createdAt: "desc" } });
  res.json(certs);
});

router.post("/", requireRole("admin", "certificate_issuer"), async (req: AuthRequest, res) => {
  const { issuer, reference, energyQuantityKWh, periodStart, periodEnd, energySource, geographicCoverage, validUntil } = req.body;
  const cert = await prisma.certificate.create({
    data: { issuer, reference, energyQuantityKWh, periodStart: new Date(periodStart), periodEnd: new Date(periodEnd), energySource, geographicCoverage, validUntil: new Date(validUntil) },
  });
  res.status(201).json(cert);
});

router.get("/:id", async (req, res) => {
  const cert = await prisma.certificate.findUnique({ where: { id: req.params.id } });
  if (!cert) return res.status(404).json({ error: "not found" });
  res.json(cert);
});

router.patch("/:id/verify", requireRole("admin", "auditor"), async (req, res) => {
  const cert = await prisma.certificate.update({ where: { id: req.params.id }, data: { verificationState: req.body.state || "verified" } });
  res.json(cert);
});

export default router;

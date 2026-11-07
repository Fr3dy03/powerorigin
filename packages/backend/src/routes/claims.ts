import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth";
import crypto from "crypto";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const { siteId, status } = req.query as any;
  const claims = await prisma.energyClaim.findMany({
    where: { ...(siteId ? { siteId } : {}), ...(status ? { status } : {}) },
    include: { certificates: { include: { certificate: true } }, attestations: true, findings: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(claims);
});

router.post("/", requireRole("admin", "operator"), async (req: AuthRequest, res) => {
  const { siteId, reportingStart, reportingEnd, energyQuantityKWh, measurementSource, methodologyVersion, certificateIds } = req.body;
  const digest = crypto.createHash("sha256").update(JSON.stringify({ siteId, reportingStart, reportingEnd, energyQuantityKWh, measurementSource, methodologyVersion, certificateIds })).digest("hex");
  const claim = await prisma.energyClaim.create({
    data: {
      siteId, reportingStart: new Date(reportingStart), reportingEnd: new Date(reportingEnd),
      energyQuantityKWh, measurementSource, methodologyVersion, evidenceDigest: digest,
      certificates: { create: (certificateIds || []).map((cid: string) => ({ certificateId: cid })) },
    },
    include: { certificates: true },
  });
  res.status(201).json(claim);
});

router.get("/:id", async (req, res) => {
  const claim = await prisma.energyClaim.findUnique({
    where: { id: req.params.id },
    include: { certificates: { include: { certificate: true } }, attestations: true, findings: true, site: true },
  });
  if (!claim) return res.status(404).json({ error: "not found" });
  res.json(claim);
});

router.post("/:id/supersede", requireRole("admin", "operator"), async (req, res) => {
  const { newClaimId } = req.body;
  await prisma.energyClaim.update({ where: { id: req.params.id }, data: { status: "superseded" } });
  res.json({ ok: true, oldClaimId: req.params.id, newClaimId });
});

router.post("/:id/revoke", requireRole("admin"), async (req, res) => {
  const claim = await prisma.energyClaim.update({ where: { id: req.params.id }, data: { status: "revoked" } });
  res.json(claim);
});

export default router;

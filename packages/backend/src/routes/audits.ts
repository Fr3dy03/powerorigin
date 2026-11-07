import { Router } from "express";
import { prisma } from "../index";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const { claimId } = req.query as any;
  const findings = await prisma.auditFinding.findMany({ where: claimId ? { claimId } : undefined });
  res.json(findings);
});

router.post("/:claimId/findings", requireRole("admin", "auditor"), async (req: AuthRequest, res) => {
  const { type, severity, description } = req.body;
  const finding = await prisma.auditFinding.create({ data: { claimId: req.params.claimId, type, severity, description } });
  res.status(201).json(finding);
});

router.patch("/findings/:id/resolve", requireRole("admin", "auditor"), async (req, res) => {
  const f = await prisma.auditFinding.update({ where: { id: req.params.id }, data: { resolved: true } });
  res.json(f);
});

router.post("/:claimId/attest", requireRole("admin", "auditor"), async (req: AuthRequest, res) => {
  const { approved, notes, evidenceDigest } = req.body;
  const att = await prisma.attestation.create({
    data: { claimId: req.params.claimId, auditorId: req.user!.id, approved, notes, evidenceDigest },
  });
  if (approved) await prisma.energyClaim.update({ where: { id: req.params.claimId }, data: { status: "attested" } });
  else await prisma.energyClaim.update({ where: { id: req.params.claimId }, data: { status: "rejected" } });
  res.status(201).json(att);
});

export default router;

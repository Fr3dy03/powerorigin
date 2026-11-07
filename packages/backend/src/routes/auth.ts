import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../index";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) return res.status(400).json({ error: "missing fields" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "email in use" });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, password: hash } });
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

router.get("/users", async (req, res) => {
  const token = req.headers.authorization;
  if (!token?.startsWith("Bearer ")) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token.slice(7), process.env.JWT_SECRET || "dev-secret") as any;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(404).json({ error: "not found" });
    res.json(user);
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
});

export default router;

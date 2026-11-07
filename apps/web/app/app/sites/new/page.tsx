"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSitePage() {
  const router = useRouter();
  const [form, setForm] = useState({ facilityId: "", operator: "", region: "", gridZone: "", reportingStart: "", reportingEnd: "" });
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("po_token");
    const r = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(form),
    });
    if (!r.ok) { setErr(await r.text()); return; }
    const site = await r.json();
    router.push(`/app/sites/${site.id}`);
  }

  const field = (k: string, label: string, type = "text") => (
    <div>
      <label className="text-sm text-secondary">{label}</label>
      <input type={type} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full border border-borderc rounded-lg px-3 py-2" required />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-heading font-bold">Add an Energy Site</h1>
      <form onSubmit={submit} className="bg-white border border-borderc rounded-xl p-6 space-y-4">
        {field("facilityId", "Facility identifier")}
        {field("operator", "Operator")}
        {field("region", "Region")}
        {field("gridZone", "Grid zone")}
        {field("reportingStart", "Reporting start", "date")}
        {field("reportingEnd", "Reporting end", "date")}
        {err && <p className="text-critical text-sm">{err}</p>}
        <button className="px-5 py-2 rounded-lg bg-forest text-white">Create site</button>
      </form>
    </div>
  );
}


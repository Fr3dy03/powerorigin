"use client";

import { useEffect, useState } from "react";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("http://localhost:4000/api/claims", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setClaims(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Energy Claims</h1>

      <div className="space-y-3">
        {claims.length === 0 && (
          <p className="text-secondary">No claims yet.</p>
        )}

        {claims.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-borderc rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-deepgreen">{c.id}</div>

              <span
                className={
                  c.status === "submitted"
                    ? "text-xs px-2 py-1 rounded bg-amber/20 text-graphite"
                    : c.status === "attested"
                    ? "text-xs px-2 py-1 bg-sage text-forest"
                    : c.status === "rejected"
                    ? "text-xs px-2 py-1 bg-critical/20 text-critical"
                    : c.status === "superseded"
                    ? "text-xs px-2 py-1 bg-graphite text-secondary"
                    : "text-xs px-2 py-1 text-secondary"
                }
              >
                {c.status}
              </span>
            </div>

            <div className="text-sm text-secondary mt-1">
              Site {c.siteId} · {c.energyQuantityKWh} kWh ·
              {c.methodologyVersion}
            </div>

            <div className="text-xs font-mono text-secondary mt-2">
              digest: {c.evidenceDigest}
            </div>

            {c.certificates?.length > 0 && (
              <div className="mt-3 p-3 bg-sage/20 rounded-lg">
                <span className="text-xs font-medium text-forest">Certificates ({c.certificates.length}):</span>
                {c.certificates.map((cert: any) => (
                  <span
                    key={cert.certificateId}
                    className="ml-1 text-xs px-1 rounded bg-forest text-white"
                  >
                    {cert.reference}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-borderc">
              <span className="text-xs text-secondary">Auditor:</span>
              <span className="text-secondary">{c.auditorId || "—"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
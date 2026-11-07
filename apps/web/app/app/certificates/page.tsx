"use client";

import { useEffect, useState } from "react";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("http://localhost:4000/api/certificates", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setCerts(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Certificates</h1>

      <div className="space-y-3">
        {certs.length === 0 && (
          <p className="text-secondary">No certificates registered.</p>
        )}

        {certs.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-borderc rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-deepgreen">{c.reference}</div>
                <div className="text-secondary mt-1">
                  {c.issuer} · {c.energyQuantityKWh} kWh · {c.energySource}
                </div>
                <div className="text-secondary">
                  {new Date(c.periodStart).toISOString().slice(0, 10)}
                  →
                  {new Date(c.periodEnd).toISOString().slice(0, 10)}&#160;· {c.geographicCoverage}
                </div>
              </div>

              <div>
                <span className="text-xs px-2 py-1 rounded bg-sage text-forest">
                  {c.verificationState}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
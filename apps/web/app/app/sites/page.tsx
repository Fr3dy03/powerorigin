"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("/api/sites", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.json())
      .then((d) => { setSites(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Sites</h1>
        <Link href="/app/sites/new" className="px-4 py-2 rounded-lg bg-forest text-white text-sm">Add Energy Site</Link>
      </div>
      {loading ? <p className="text-secondary">Loadingâ€¦</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.length === 0 && <p className="text-secondary">No sites yet.</p>}
          {sites.map((s) => (
            <Link key={s.id} href={`/app/sites/${s.id}`} className="bg-white border border-borderc rounded-xl p-5 block hover:border-forest">
              <div className="font-semibold text-deepgreen">{s.facilityId}</div>
              <div className="text-sm text-secondary mt-1">{s.operator} Â· {s.region} Â· {s.gridZone}</div>
              <div className="text-xs text-secondary mt-2">Meters: {s.meters?.length ?? 0}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


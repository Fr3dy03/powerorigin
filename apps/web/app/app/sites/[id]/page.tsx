"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IntervalEvidence } from "@powerorigin/shared";
import { EnergyIntervalRibbon } from "@/components/EnergyIntervalRibbon";

export default function SiteDetailPage() {
  const params = useParams();
  const [site, setSite] = useState<any>(null);
  const [intervals, setIntervals] = useState<IntervalEvidence[]>([]);
  const [loadingIntervals, setLoadingIntervals] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    const url = new URL(`http://localhost:4000/api/sites/${params.id}`);
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((s) => {
        setSite(s);
        setLoadingIntervals(false);
      })
      .catch(() => setLoadingIntervals(false));
  }, [params.id]);

  useEffect(() => {
    if (!site) return;
    const token = localStorage.getItem("po_token");
    const url = new URL("http://localhost:4000/api/readings");
    url.searchParams.set("siteId", site.id);
    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => {
        setIntervals(Array.isArray(d) ? d : []);
        setLoadingIntervals(false);
      })
      .catch(() => setLoadingIntervals(false));
  }, [site?.id]);

  if (!site) return <p className="text-secondary">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">{site.facilityId}</h1>

      <div className="bg-white border border-borderc rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-secondary">Operator</div>
          <div>{site.operator}</div>
        </div>
        <div>
          <div className="text-secondary">Region</div>
          <div>{site.region}</div>
        </div>
        <div>
          <div className="text-secondary">Grid zone</div>
          <div>{site.gridZone}</div>
        </div>
        <div>
          <div className="text-secondary">Status</div>
          <div>{site.active ? "Active" : "Inactive"}</div>
        </div>
      </div>

      <h2 className="text-lg font-heading font-bold">Energy consumption timeline</h2>
      {intervals.length > 0 ? (
        <EnergyIntervalRibbon compact />
      ) : (
        <p className="text-sm text-secondary mt-4">
          No interval data yet. Register a meter and ingest readings to see the timeline.
        </p>
      )}

      <h2 className="text-lg font-heading font-bold">Grid intensity timeline</h2>
      {intervals.length > 0 ? (
        <p className="mt-2 text-sm text-secondary">
          Grid intensity data is available per interval. Hover over the Energy Interval
          Ribbon to see kWh and intensity values for each hour.
        </p>
      ) : (
        <p className="text-sm text-secondary mt-4">
          No grid intensity data yet. Ingest grid-intensity data via the Integrations page.
        </p>
      )}

      <h2 className="text-lg font-heading font-bold">Source mix where supported by evidence</h2>
      <p className="text-sm text-secondary mt-2">
        Source mix is derived from certificate coverage and auditor attestations. Intervals
        with verified certificate coverage show the attributed renewable proportion.
      </p>

      <h2 className="text-lg font-heading font-bold">Energy attribute certificate coverage</h2>
      <div className="mt-3">
        {site.certificates?.length > 0 ? (
          site.certificates.map((c: any) => (
            <div
              key={c.id}
              className="bg-white border border-borderc rounded-xl p-4"
            >
              <div className="font-semibold text-deepgreen">{c.reference}</div>
              <div className="text-secondary mt-1">
                {c.issuer} · {c.energyQuantityKWh} kWh · {c.energySource}
              </div>
              <div className="text-secondary">
                {new Date(c.periodStart).toISOString().slice(0, 10)}&#160;→&#160;
                {new Date(c.periodEnd).toISOString().slice(0, 10)} {c.geographicCoverage}
              </div>
              <div className="mt-1">
                <span className="text-xs px-2 py-1 rounded bg-sage text-forest">
                  {c.verificationState}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-secondary">No certificates linked yet.</p>
        )}
      </div>

      <h2 className="text-lg font-heading font-bold">Missing measurement intervals</h2>
      <p className="text-sm text-secondary mt-2">
        Meter interval coverage is calculated from the registered meter's intervalMinutes setting
        compared against the reporting period. Gaps are flagged where meter readings are missing.
      </p>

      <h2 className="text-lg font-heading font-bold">Data source provenance</h2>
      <p className="text-sm text-secondary mt-2">
        Meter connections: {site.meters?.length ?? 0}
      </p>

      <h2 className="text-lg font-heading font-bold">Independent attestations</h2>
      <p className="text-sm text-secondary mt-2">
        No attestations yet. An auditor must inspect source data and issue an attestation before
        a claim can be verified.
      </p>

      <Link
        href="/app/sites"
        className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border border-forest text-forest text-sm font-medium hover:bg-forest hover:text-white"
      >
        ← Back to sites
      </Link>
    </div>
  );
}
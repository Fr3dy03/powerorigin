"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReportsPage() {
  const [siteId, setSiteId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const generateReport = async () => {
    if (!siteId || !dateFrom || !dateTo) return;
    setLoading(true);
    const token = localStorage.getItem("po_token");
    const r = await fetch(
      `http://localhost:4000/api/reports/site/${siteId}?from=${dateFrom}&to=${dateTo}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (r.ok) {
      const data = await r.json();
      setReport(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Reports</h1>

      <p className="text-sm text-secondary">
        Downloadable reports include energy consumption, grid intensity, certificate coverage,
        methodology, data gaps and verification history.
      </p>

      <div className="bg-white border border-borderc rounded-xl p-6 mb-6">
        <h3 className="text-sm font-heading font-bold text-deepgreen mb-4">
          Generate Report
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          generateReport();
        }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-secondary text-sm">Site</label>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              >
                <option value="">Select a site</option>
                {/* Options would be populated from the sites API */}
              </select>
            </div>
            <div>
              <label className="text-secondary text-sm">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-secondary text-sm">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-forest text-white font-medium hover:bg-deepgreen">
            Generate Report
          </button>
        </form>
      </div>

      {report && (
        <div className="bg-white border border-borderc rounded-xl p-6">
          <h3 className="text-xl font-heading font-bold text-deepgreen mb-4">
            Report: {siteId || "selected site"}
          </h3>

          {report.energyConsumption && (
            <div className="mb-4">
              <p className="text-secondary mb-1">Energy Consumption</p>
              <p className="font-mono text-lg text-deepgreen">
                {report.energyConsumption} kWh
              </p>
            </div>
          )}

          {report.gridIntensity && (
            <div className="mb-4">
              <p className="text-secondary mb-1">Grid Carbon Intensity</p>
              <p className="font-mono text-lg text-deepgreen">
                {report.gridIntensity} gCO₂/kWh
              </p>
            </div>
          )}

          {report.certificateCoverage !== undefined && (
            <div>
              <p className="text-secondary mb-1">Certificate Coverage</p>
              <p className="font-mono text-lg text-deepgreen">
                {report.certificateCoverage} kWh
              </p>
            </div>
          )}

          {report.methodology && (
            <div>
              <p className="text-secondary mb-1">Methodology</p>
              <p className="text-secondary small">{report.methodology}</p>
            </div>
          )}

          {report.dataGaps && report.dataGaps > 0 && (
            <div>
              <p className="text-secondary mb-1">Data Gaps</p>
              <p className="font-mono text-lg text-critical">
                {report.dataGaps} intervals
              </p>
            </div>
          )}

          {report.verificationHistory && (
            <div>
              <p className="text-secondary mb-1">Verification History</p>
              <p className="text-secondary small">{report.verificationHistory}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/app/sites"
          className="inline-flex items-center px-4 py-2 rounded-lg border border-forest text-forest text-sm font-medium hover:bg-forest hover:text-white"
        >
          ← Back to sites
        </Link>
      </div>
    </div>
  );
}
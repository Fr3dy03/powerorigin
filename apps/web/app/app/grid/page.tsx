"use client";

import { useEffect, useState } from "react";

export default function GridPage() {
  const [intensityData, setIntensityData] = useState<any[]>([]);
  const [siteId, setSiteId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("/api/integrations/grid", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setIntensityData(Array.isArray(d) ? d : []));
  }, []);

  const fetchIntensity = async () => {
    if (!siteId || !from || !to) return;
    setLoading(true);
    const token = localStorage.getItem("po_token");
    const r = await fetch(
      "/api/integrations/grid?siteId=" +
        siteId +
        "&from=" +
        from +
        "&to=" +
        to,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (r.ok) {
      const data = await r.json();
      setIntensityData(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Grid Data</h1>

      <p className="text-sm text-secondary">
        Hourly grid carbon intensity by site. Annual averages are labelled as such and never
        used as hourly evidence.
      </p>

      {/* Grid intensity ingestion info */}
      <div className="bg-white border border-borderc rounded-xl p-5 mb-6">
        <h3 className="text-sm font-heading font-bold text-deepgreen mb-2">
          Grid Data Ingestion
        </h3>
        <p className="text-secondary text-sm mb-3">
          POST /api/integrations/grid (hourly values only). Caller must supply hourly values;
          annual averages are rejected for hourly evidence.
        </p>
        <p className="text-xs text-secondary">
          Endpoint expects: {siteId} and values: [timestamp, gCo2PerKWh, source?, resolution?]
        </p>
        <p className="text-xs text-secondary">
          Resolution must be "hourly"; otherwise the request is rejected.
        </p>
      </div>

      {/* Query grid intensity */}
      <div className="bg-white border border-borderc rounded-xl p-5 mb-6">
        <h3 className="text-sm font-heading font-bold text-deepgreen mb-4">
          Query Grid Intensity
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          fetchIntensity();
        }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-secondary text-sm">Site ID</label>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              >
                <option value="">Select site</option>
              </select>
            </div>
            <div>
              <label className="text-secondary text-sm">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-secondary text-sm">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <button type="submit" className="py-2 rounded-lg bg-forest text-white font-medium">
            Fetch Data
          </button>
        </form>
      </div>

      {/* Display intensity data */}
      {intensityData.length > 0 && (
        <div>
          <p className="text-secondary text-sm mb-3">
            Showing {intensityData.length} grid intensity readings
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-secondary border-b border-borderc">
                <th className="py-3">Timestamp</th>
                <th className="text-width-150">gCOâ‚‚/kWh</th>
                <th className="text-width-120">Source</th>
                <th className="text-width-80">Resolution</th>
              </tr>
            </thead>
            <tbody>
              {intensityData.map((d) => (
                <tr key={d.id} className="border-t border-borderc">
                  <td className="py-3 font-mono text-xs">
                    {new Date(d.timestamp).toISOString()}
                  </td>
                  <td className="font-mono text-lg text-deepgreen">
                    {d.gCo2PerKWh}
                  </td>
                  <td className="text-secondary text-sm">{d.source || "â€”"}</td>
                  <td className="text-secondary text-sm">{d.resolution || "hourly"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No data message */}
      {intensityData.length === 0 && (
        <p className="text-sm text-secondary">
          No grid intensity data yet. Use the form above to query, or ingest data via the
          integrations endpoint.
        </p>
      )}
    </div>
  );
}

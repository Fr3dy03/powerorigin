"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MetersPage() {
  const [meters, setMeters] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("/api/meters", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setMeters(Array.isArray(d) ? d : []));
  }, []);

  const handleCreate = async (form: any) => {
    setCreating(true);
    const token = localStorage.getItem("po_token");
    const r = await fetch("/api/meters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      const meter = await r.json();
      setMeters(prev => [meter, ...prev]);
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Meter Feeds</h1>

      <p className="text-sm text-secondary">
        Register meters, configure supported meter APIs, authenticate securely, map units,
        validate incoming data, inspect connection health, reconcile missing readings.
      </p>

      {/* Onboarding wizard */}
      <div className="bg-white border border-borderc rounded-xl p-6 mb-6">
        <h2 className="text-lg font-heading font-bold text-deepgreen mb-4">
          Register a New Meter
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const form = Object.fromEntries(formData.entries());
            handleCreate(form);
          }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label className="text-secondary text-sm">Site ID</label>
            <select
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            >
              <option value="">Select site</option>
              {/* Options populated from sites API */}
            </select>
          </div>
          <div>
            <label className="text-secondary text-sm">Vendor</label>
            <input
              type="text"
              placeholder="e.g. Itron, Elmeasure"
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-secondary text-sm">External ID</label>
            <input
              type="text"
              placeholder="Meter external identifier"
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-secondary text-sm">Interval (minutes)</label>
            <input
              type="number"
              value="60"
              min="1"
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            />
            <span className="text-xs text-secondary">Default: 60</span>
          </div>
          <div>
            <label className="text-secondary text-sm">Unit</label>
            <select
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            >
              <option value="kWh">kWh</option>
              <option value="MJ">MJ</option>
              <option value="GJ">GJ</option>
            </select>
          </div>
          <div>
            <label className="text-secondary text-sm">Status</label>
            <select
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            >
              <option value="connected">connected</option>
              <option value="disconnected">disconnected</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="col-span-6 mt-4 py-2 rounded-lg bg-forest text-white font-medium hover:bg-deepgreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creatingâ€¦" : "Register meter"}
          </button>
        </form>
      </div>

      {/* Registered meters list */}
      <div>
        {meters.length === 0 ? (
          <p className="text-secondary">No meters registered.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-secondary border-b border-borderc">
                <th className="py-3">Vendor</th>
                <th>External ID</th>
                <th className="text-width-120">Interval</th>
                <th>Unit</th>
                <th>Status</th>
                <th className="text-width-180">Last reading</th>
                <th className="text-width-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meters.map((m) => (
                <tr key={m.id} className="border-t border-borderc">
                  <td className="py-3">{m.vendor}</td>
                  <td className="font-mono text-xs">{m.externalId}</td>
                  <td>{m.intervalMinutes}m</td>
                  <td>{m.unit}</td>
                  <td>{m.status}</td>
                  <td className="font-mono text-xs">
                    {m.lastReadingAt ? new Date(m.lastReadingAt).toISOString() : "â€”"}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/app/meters/${m.id}`}
                      className="text-forest text-sm hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

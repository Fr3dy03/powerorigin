"use client";

import { useEffect, useState } from "react";

export default function AuditsPage() {
  const [findings, setFindings] = useState<any[]>([]);
  const [newFinding, setNewFinding] = useState({ type: "", severity: "", description: "" });

  useEffect(() => {
    const token = localStorage.getItem("po_token");
    fetch("/api/audits", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setFindings(Array.isArray(d) ? d : []));
  }, []);

  const handleCreateFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("po_token");
    const r = await fetch("/api/audits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newFinding),
    });
    if (r.ok) {
      r.json().then((json) => {
        setNewFinding({ type: "", severity: "", description: "" });
        setFindings(prev => [json, ...prev]);
      });
    }
  };

  const handleResolve = async (id: string) => {
    const token = localStorage.getItem("po_token");
    await fetch(`/api/audits/findings/${id}/resolve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    setFindings(prev => prev.filter((f: any) => f.id !== id));
  };

  const handleAttestForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const select = e.target as HTMLSelectElement;
    const claimId = select?.dataset?.claimId || "";
    const approved = select?.dataset?.approved === "true";
    const notes = (select as any).notesValue || "";
    const evidenceDigest = (select as any).evidenceDigestValue || "";
    const token = localStorage.getItem("po_token");
    const r = await fetch(`/api/audits/${claimId}/attest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ approved, notes, evidenceDigest }),
    });
    if (r.ok) {
      const att = await r.json();
      setFindings(prev => prev.map((f: any) =>
        f.id === att.id ? att : f
      ));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Audits</h1>

      <p className="text-sm text-secondary">
        Auditor workspace: inspect source data, identify missing intervals, review methodology,
        request corrections, approve or reject evidence, issue attestations.
      </p>

      {/* Create finding form */}
      <div className="bg-white border border-borderc rounded-xl p-4 mb-6">
        <h3 className="text-sm font-heading font-bold text-deepgreen mb-3">Create Audit Finding</h3>
        <form onSubmit={handleCreateFinding} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-secondary text-sm">Type</label>
            <select
              value={newFinding.type}
              onChange={(e) => setNewFinding({ ...newFinding, type: e.target.value })}
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            >
              <option value="missing_interval">Missing interval</option>
              <option value="duplicate_reading">Duplicate reading</option>
              <option value="timestamp_error">Timestamp error</option>
              <option value="unit_mismatch">Unit mismatch</option>
              <option value="certificate_expiry">Certificate expiry</option>
              <option value="methodology">Methodology</option>
            </select>
          </div>
          <div>
            <label className="text-secondary text-sm">Severity</label>
            <select
              value={newFinding.severity}
              onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value })}
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
            >
              <option value="info">info</option>
              <option value="warning">warning</option>
              <option value="critical">critical</option>
            </select>
          </div>
          <div>
            <label className="text-secondary text-sm">Description</label>
            <textarea
              value={newFinding.description}
              onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
              className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2 h-20 resize-none"
              placeholder="Describe the finding..."
              required
            ></textarea>
          </div>
          <button type="submit" className="col-span-2 mt-4 py-2 rounded-lg bg-forest text-white font-medium">
            Create finding
          </button>
        </form>
      </div>

      {findings.length === 0 ? (
        <p className="text-secondary">No audit findings.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {findings.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-borderc rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-deepgreen">{f.type}</div>
                  <div className="text-secondary">{f.severity}</div>
                </div>
                <div className="text-xs text-secondary">{f.resolved ? "Resolved" : "Open"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attestation form below findings */}
      {findings.length > 0 && (
        <div className="mt-6 bg-white border border-borderc rounded-xl p-4">
          <h3 className="text-sm font-heading font-bold text-deepgreen mb-3">
            Attest Energy Claim
          </h3>
          <p className="text-sm text-secondary mb-3">
            Select a claim to attest or reject. Approved attestations mark the claim as "attested";
            rejected ones mark it as "rejected".
          </p>
          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={handleAttestForm}
          >
            <div>
              <label className="text-secondary text-sm">Claim ID</label>
              <select
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              >
                {findings
                  .filter((f: any) => !f.resolved)
                  .map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.id}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="text-secondary text-sm">Approved</label>
              <select
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
            <div>
              <label className="text-secondary text-sm">Notes</label>
              <textarea
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2 h-20 resize-none"
                placeholder="Optional notes..."
              ></textarea>
            </div>
            <div>
              <label className="text-secondary text-sm">Evidence digest</label>
              <input
                type="text"
                className="mt-1 block w-full border border-borderc rounded-lg px-3 py-2"
                placeholder="e.g. sha256hash..."
              />
            </div>
            <button type="submit" className="col-span-2 mt-4 py-2 rounded-lg bg-forest text-white font-medium">
              Issue attestation
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

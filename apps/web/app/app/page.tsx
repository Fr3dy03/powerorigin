import { EnergyIntervalRibbon } from "@/components/EnergyIntervalRibbon";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Energy Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total measured energy", value: "—", note: "Connect a site to begin" },
          { label: "Reporting period", value: "—", note: "No active period" },
          { label: "Meter feed status", value: "0 connected", note: "Register a meter" },
          { label: "Verified attributes", value: "0 kWh", note: "Awaiting attestation" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-borderc rounded-xl p-4">
            <div className="text-xs text-secondary">{k.label}</div>
            <div className="text-2xl font-heading font-bold text-deepgreen mt-1">{k.value}</div>
            <div className="text-xs text-secondary mt-1">{k.note}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Certificate coverage", value: "0%" },
          { label: "Grid carbon intensity", value: "— gCO₂/kWh" },
          { label: "Unverified intervals", value: "0" },
          { label: "Missing data intervals", value: "0" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-borderc rounded-xl p-4">
            <div className="text-xs text-secondary">{k.label}</div>
            <div className="text-xl font-heading font-bold text-deepgreen mt-1">{k.value}</div>
          </div>
        ))}
      </div>
      <EnergyIntervalRibbon />
    </div>
  );
}

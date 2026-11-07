"use client";
export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "Green Web Foundation CO2.js", note: "Used where its available data fits the required use case." },
          { name: "Electricity Maps", note: "Requires licensed access. Commercial terms, geography, resolution and historical availability must be verified." },
          { name: "Meter vendor APIs", note: "Configured per meter. Credentials stored server-side only." },
          { name: "Energy certificate providers", note: "Issuer integration with reference verification." },
        ].map((i) => (
          <div key={i.name} className="bg-white border border-borderc rounded-xl p-5">
            <div className="font-semibold text-deepgreen">{i.name}</div>
            <p className="text-sm text-secondary mt-1">{i.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


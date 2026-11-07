import Link from "next/link";
import { BotChainFooter } from "@/components/BotChainFooter";
import { EnergyIntervalRibbon } from "@/components/EnergyIntervalRibbon";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center text-white font-bold">P</div>
          <span className="font-heading font-bold text-xl text-deepgreen">PowerOrigin</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="#how" className="text-secondary hover:text-forest">How it works</Link>
          <Link href="#faq" className="text-secondary hover:text-forest">FAQ</Link>
          <Link href="/app" className="px-4 py-2 rounded-lg bg-forest text-white hover:bg-deepgreen">Open app</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-medium text-forest bg-sage px-3 py-1 rounded-full mb-4">
              Energy provenance for compute
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
              Know the energy behind every compute workload.
            </h1>
            <p className="mt-5 text-lg text-secondary max-w-xl">
              Connect meter evidence, grid data and energy certificates to create transparent,
              independently verifiable energy claims.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/sites/new"
                className="px-6 py-3 rounded-lg bg-forest text-white font-medium hover:bg-deepgreen"
              >
                Add an Energy Site
              </Link>
              <Link
                href="#evidence"
                className="px-6 py-3 rounded-lg border border-borderc text-graphite hover:bg-white"
              >
                Explore Energy Evidence
              </Link>
            </div>
          </div>
          <div id="evidence">
            <EnergyIntervalRibbon />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">The energy transparency problem</h2>
        <p className="mt-3 text-secondary max-w-3xl">
          Compute operators are asked to report the energy behind AI training, inference and
          data-centre operations. Grid averages and annual certificates cannot answer what was
          consumed, when, and by which workload. PowerOrigin assembles meter readings, hourly grid
          intensity, certificate coverage and independent attestations into one auditable record.
        </p>
      </section>

      <section id="how" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">How PowerOrigin works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {[

            {
              t: "Connect meters",
              d:
                "Register facility meters and configure supported vendor APIs. Map units, validate "
                + "timestamps, and inspect connection health.",
            },

            {
              t: "Ingest intervals",
              d:
                "Validate timestamps, units and missing readings. Idempotent upserts ensure no "
                + "duplicate data is stored.",
            },

            {
              t: "Match certificates",
              d:
                "Allocate energy attribute certificates to intervals. Clearly distinguish measured "
                + "energy, estimated intensity and independently verified attributes.",
            },

            {
              t: "Verify & publish",
              d:
                "Auditor attests; commitment anchored on BOT Chain. Raw meter streams and private "
                + "credentials never leave your systems.",
            },
          ].map((s) => (
            <div key={s.t} className="bg-white border border-borderc rounded-xl p-5">
              <div className="text-forest font-semibold">{s.t}</div>
              <p className="text-sm text-secondary mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">Facility and meter connections</h2>
        <p className="mt-3 text-secondary max-w-3xl">
          Each site carries a facility identifier, operator, region, grid zone, meter connections,
          reporting period and certificate status. Meter feeds are validated for duplicates,
          incorrect timestamps and time-zone boundaries.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">Hourly energy evidence</h2>
        <p className="mt-3 text-secondary max-w-3xl">
          Measured kWh, grid carbon intensity and certificate coverage are shown per interval.
          Annual grid averages are never presented as hourly evidence.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">Certificate coverage</h2>
        <p className="mt-3 text-secondary max-w-3xl">
          Track issuer, reference, quantity, period, source, geographic coverage, validity and
          verification state. Expired or out-of-region certificates are flagged.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">Independent verification</h2>
        <p className="mt-3 text-secondary max-w-3xl">
          Auditors inspect source data, identify missing intervals, review methodology and issue
          attestations. Claims are never marked verified without an auditor attestation.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">Reporting and exports</h2>
        <p className="mt-3 text-secondary max-w-3xl">
          Downloadable reports include energy consumption, grid intensity, certificate coverage,
          methodology, data gaps and verification history.
        </p>
      </section>

      <section id="faq" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold">FAQ</h2>
        <div className="mt-6 space-y-4 max-w-3xl">
          {[

            {
              q: "Does PowerOrigin create carbon credits?",
              a: "No. It records evidence and attestations only.",
            },

            {
              q: "Can a facility be called 100% renewable from a grid average?",
              a:
                "No. Claims require measured energy, certificate coverage and auditor attestation.",
            },

            {
              q: "What is stored on-chain?",
              a:
                "Commitments, attestations, supersession and revocation status — never raw meter "
                + "streams.",
            },

            {
              q: "Which grid data is used?",
              a:
                "Licensed hourly data where available. Annual averages are clearly labelled and "
                + "never used as hourly evidence.",
            },
          ].map((f) => (
            <div key={f.q} className="bg-white border border-borderc rounded-xl p-5">
              <div className="font-semibold text-deepgreen">{f.q}</div>
              <p className="text-sm text-secondary mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-heading font-bold">
          Ready to make energy claims you can defend?
        </h2>
        <div className="mt-6">
          <Link
            href="/app"
            className="px-8 py-3 rounded-lg bg-forest text-white font-medium hover:bg-deepgreen"
          >
            Add an Energy Site
          </Link>
        </div>
      </section>

      <BotChainFooter />
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IntervalEvidence } from "@powerorigin/shared";

/**
 * Generate deterministic sample intervals for the visual (clearly labeled as illustrative)
 */
function sampleIntervals(): IntervalEvidence[] {
  const out: IntervalEvidence[] = [];
  const base = new Date("2026-01-15T00:00:00Z").getTime();
  for (let i = 0; i < 24; i++) {
    const t = new Date(base + i * 3600 * 1000);
    const hour = t.getUTCHours();
    const consumption = 40 + 30 * Math.sin((hour / 24) * Math.PI * 2) + (hour >= 9 && hour <= 17 ? 25 : 0);
    const intensity = 320 + 80 * Math.sin((hour / 24) * Math.PI * 2 + 1);
    const cert = hour >= 10 && hour <= 16 ? consumption * 0.6 : 0;
    out.push({
      intervalStart: t.toISOString(),
      intervalEnd: new Date(t.getTime() + 3600000).toISOString(),
      measuredKWh: Math.round(consumption * 10) / 10,
      gridIntensityGCo2: Math.round(intensity),
      sourceEvidence: hour >= 10 && hour <= 16 ? "meter + certificate" : "meter",
      certificateCoverageKWh: Math.round(cert * 10) / 10,
      verificationState: hour >= 10 && hour <= 16 ? "verified" : "unverified",
    });
  }
  return out;
}

/**
 * Format kWh to a nice string
 */
function formatKWh(kWh: number): string {
  if (kWh >= 100) return kWh.toFixed(1);
  if (kWh >= 10) return kWh.toFixed(2);
  return kWh.toFixed(3);
}

/** Verification state badge with appropriate colour */
function VerificationBadge({ state }: { state: IntervalEvidence["verificationState"] }) {
  let bgClass, labelText;

  if (state === "verified") {
    bgClass = "bg-sage text-forest";
    labelText = "Independently verified attribute";
  } else if (state === "pending") {
    bgClass = "bg-amber/20 text-graphite";
    labelText = "Pending auditor review";
  } else if (state === "failed") {
    bgClass = "bg-critical/20 text-critical";
    labelText = "Verification failed";
  } else {
    bgClass = "bg-secondary text-secondary";
    labelText = "Unverified interval";
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${bgClass}`}>
      {labelText}
    </span>
  );
}

/** Row component for detail display */
function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const monoClass = mono ? "font-mono text-graphite" : "text-graphite";
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="min-w-0 text-secondary">{label}</span>
      <span className={`${monoClass} min-w-0 text-right break-words`}>{value}</span>
    </div>
  );
}

/** Energy Interval Ribbon - signature product interface */
export function EnergyIntervalRibbon({
  compact = false,
}: { compact?: boolean }) {
  const data = useMemo(sampleIntervals, []);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-borderc rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-deepgreen leading-relaxed">
              Consumption (kWh) & grid intensity (gCO₂/kWh)
            </h3>
            <span className="text-xs text-secondary font-mono whitespace-nowrap">
              24 intervals · 1h
            </span>
          </div>

          <div className="h-64 relative">
            {/* kWh line area - subtle forest gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #0F6670 0%, #2CB8A6 100%)",
                maskImage: "linear-gradient(to bottom, black 80%, transparent 80%)",
              }}
            />
            {/* Intensity indicator bars - amber accents */}
            {data.map((d, i) => {
              const hour = new Date(d.intervalStart).getUTCHours();
              const isVerified = d.verificationState === "verified";
              const intensity = d.gridIntensityGCo2;
              // Height proportional to intensity, capped at 24px
              const barHeight = Math.min(24, (intensity / 500) * 24);
              return (
                <div
                  key={i}
                    className="absolute bottom-0 w-1 rounded bg-amber/30"
                    style={{ left: `${(i / 24) * 100}%`, height: `${barHeight}px`, transition: "height 0.3s ease" }}
                />
              );
            })}
            {/* Certificate coverage bars - leaf green for verified */}
            <div className="mt-4 pt-4 border-t border-borderc">
              <span className="text-xs text-secondary mb-1">
                Certificate coverage (kWh)
              </span>
              <div className="flex items-end gap-px h-12">
              {data.map((d, i) => {
                const isVerified = d.verificationState === "verified";
                const certKWh = d.certificateCoverageKWh;
                // Height proportional to certificate coverage, capped at 16px
                const barHeight = certKWh > 0 ? Math.min(16, (certKWh / 20) * 16) : 0;
                const barFillClass = isVerified ? "bg-leaf" : "bg-amber";
                const textClass = isVerified ? "text-forest" : "text-graphite";
                return (
                  <div
                    key={i}
                    className={`min-w-0 flex-1 rounded-t ${barFillClass} ${textClass}`}
                    style={{ height: `${Math.max(1, barHeight)}px` }}
                  >
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-borderc rounded-xl p-4">
          <h3 className="text-sm font-semibold text-deepgreen mb-2">
            Interval evidence
          </h3>
          {selected != null && data[selected] && (
            <div className="space-y-2 text-sm">
              <Row
                label="Interval"
                value={
                  new Date(data[selected].intervalStart).toISOString().slice(11, 16) +
                  " – " +
                  new Date(data[selected].intervalEnd).toISOString().slice(11, 16) +
                  " UTC"
                }
              />
              <Row label="Measured kWh" value={formatKWh(data[selected].measuredKWh)} />
              <Row label="Grid intensity" value={data[selected].gridIntensityGCo2 + " gCO₂/kWh"} />
              <Row label="Source evidence" value={data[selected].sourceEvidence} />
              <Row label="Certificate coverage" value={formatKWh(data[selected].certificateCoverageKWh) + " kWh"} />
              <div className="pt-2">
                <VerificationBadge state={data[selected].verificationState} />
              </div>
              <p className="text-xs text-secondary mt-3">
                Illustrative sample data. Live intervals come from registered meters and licensed grid data.
              </p>
            </div>
          )}
          {selected != null && (
            <button
              onClick={() => setSelected(null)}
              className="mt-2 w-full py-2 rounded-lg bg-sage text-forest text-sm font-medium hover:bg-forest hover:text-white"
            >
              Close evidence drawer
            </button>
          )}
        </div>
      </div>

      {/* Evidence selector - interval clicks */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-2">
        {data.map((d, i) => (
          <button
            key={i}
            className={`
              flex-1 rounded-lg p-2 flex flex-col items-center gap-1 ${
                selected === i
                  ? "bg-forest text-white"
                  : "bg-white border border-borderc text-forest hover:bg-sage hover:text-forest"
              }
            `}
            onClick={() => setSelected(i)}
            style={{
              height: "60px",
              fontSize: "10px",
              overflow: "hidden",
            }}
          >
            <div className="font-mono text-xs text-graphite">
              {new Date(d.intervalStart).getUTCHours().toString().padStart(2, "0")}:00
            </div>
            <div className="font-medium text-deepgreen">
              {formatKWh(d.measuredKWh)} kWh
            </div>
            <div className="text-amber text-xs">
              {d.gridIntensityGCo2} gCO₂
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
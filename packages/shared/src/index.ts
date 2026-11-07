export type EnergySource = "grid" | "renewable" | "mixed" | "unknown";
export type ClaimStatus = "draft" | "submitted" | "attested" | "rejected" | "revoked" | "superseded";
export type VerificationState = "unverified" | "pending" | "verified" | "failed";

export interface Site {
  id: string;
  facilityId: string;
  operator: string;
  region: string;
  gridZone: string;
  reportingStart: string;
  reportingEnd: string;
  active: boolean;
}

export interface Meter {
  id: string;
  siteId: string;
  vendor: string;
  externalId: string;
  intervalMinutes: number;
  unit: string;
  status: "connected" | "degraded" | "disconnected";
  lastReadingAt?: string;
}

export interface IntervalReading {
  id: string;
  meterId: string;
  siteId: string;
  timestamp: string; // ISO UTC
  kWh: number;
  quality: "measured" | "estimated" | "missing";
  source: string;
}

export interface GridIntensity {
  siteId: string;
  timestamp: string;
  gCo2PerKWh: number;
  source: "electricitymaps" | "co2js" | "manual";
  resolution: "hourly" | "annual";
}

export interface Certificate {
  id: string;
  issuer: string;
  reference: string;
  energyQuantityKWh: number;
  periodStart: string;
  periodEnd: string;
  energySource: EnergySource;
  geographicCoverage: string;
  validUntil: string;
  verificationState: VerificationState;
}

export interface EnergyClaim {
  id: string;
  siteId: string;
  reportingStart: string;
  reportingEnd: string;
  energyQuantityKWh: number;
  measurementSource: string;
  methodologyVersion: string;
  certificateIds: string[];
  auditorId?: string;
  status: ClaimStatus;
  evidenceDigest: string;
  onChainClaimId?: string;
}

export interface Attestation {
  id: string;
  claimId: string;
  auditorId: string;
  approved: boolean;
  notes?: string;
  issuedAt: string;
  evidenceDigest: string;
}

export interface AuditFinding {
  id: string;
  claimId: string;
  type: "missing_interval" | "duplicate_reading" | "timestamp_error" | "unit_mismatch" | "certificate_expiry" | "methodology";
  severity: "info" | "warning" | "critical";
  description: string;
  resolved: boolean;
}

export interface IntervalEvidence {
  intervalStart: string;
  intervalEnd: string;
  measuredKWh: number;
  gridIntensityGCo2: number;
  sourceEvidence: string;
  certificateCoverageKWh: number;
  verificationState: VerificationState;
}

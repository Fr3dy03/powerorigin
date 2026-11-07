import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const CHAIN_ID = Number(process.env.BOT_CHAIN_ID || 968);
const RPC_URL = process.env.BOT_RPC_URL || "https://rpc.bohr.life";

export const botChain = {
  id: CHAIN_ID,
  name: "BOT Chain",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  blockExplorers: { default: { name: "BOT Explorer", url: process.env.BOT_EXPLORER_URL || "https://scan.bohr.life" } },
};

export const publicClient = createPublicClient({ chain: botChain as any, transport: http(RPC_URL) });

export function getWalletClient() {
  const pk = process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) return null;
  const account = privateKeyToAccount(pk as `0x${string}`);
  return createWalletClient({ account, chain: botChain as any, transport: http(RPC_URL) });
}

export const REGISTRY_ABI = parseAbi([
  "function registerSite(bytes32 siteId, address operator, string gridZone)",
  "function createClaim(bytes32 claimId, bytes32 siteId, uint64 reportingStart, uint64 reportingEnd, bytes32 meterCommitment, bytes32 methodologyHash, bytes32 certificateCommitment, bytes32 evidenceDigest)",
  "function attestEnergyClaim(bytes32 claimId, bytes32 evidenceDigest)",
  "function revokeClaim(bytes32 claimId)",
  "function supersedeClaim(bytes32 oldClaimId, bytes32 newClaimId)",
  "function getClaim(bytes32 claimId) view returns (tuple(bytes32 claimId, bytes32 siteId, uint64 reportingStart, uint64 reportingEnd, bytes32 meterCommitment, bytes32 methodologyHash, bytes32 certificateCommitment, address issuer, bytes32 evidenceDigest, uint8 status))",
  "function getClaimStatus(bytes32 claimId) view returns (uint8)",
  "function verifyIssuer(address issuer) view returns (bool)",
]);

export async function getChainId() {
  return publicClient.getChainId();
}

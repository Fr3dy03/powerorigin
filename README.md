# PowerOrigin

Energy provenance and evidence platform for data centres and distributed compute infrastructure.

## What it answers
- What energy was consumed?
- When was it consumed?
- What was the reported energy source?
- Which certificate supports the claim?
- Who verified the claim?
- Which methodology was used?

## Repository layout
- `apps/web` — Next.js marketing site + authenticated application
- `packages/backend` — TypeScript Express API, Prisma, BullMQ workers
- `packages/shared` — shared types
- `packages/contracts` — Solidity `EnergyEvidenceRegistry` (Foundry)
- `docs/` — documentation and BOT Chain brand kit

## Prerequisites
- Node.js >= 20
- PostgreSQL (with TimescaleDB optional)
- Redis
- Foundry (forge) for contracts

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run db:generate --workspace=packages/backend`
4. `npm run db:migrate --workspace=packages/backend`
5. `npm run dev --workspace=packages/backend`
6. `npm run dev --workspace=apps/web`

## Smart contracts
```
cd packages/contracts
forge build
forge test
```
Deploy to Bohr testnet (chain id 968):
# First simulate; this must not broadcast a transaction.
forge script script/Deploy.s.sol --rpc-url https://rpc.bohr.life

# After verifying the simulation, deploy with a funded testnet key.
forge script script/Deploy.s.sol --rpc-url https://rpc.bohr.life --broadcast

Required deployment environment:
- `DEPLOYER_PRIVATE_KEY` — funded BOT Chain testnet deployer key; never commit it.
- `REGISTRY_ADMIN` — optional explicit admin address. If omitted, the deployer address is used.

After deployment, copy the printed contract address into `REGISTRY_ADDRESS` for the backend environment and record the transaction hash in the deployment notes. The deployment script refuses to run on a chain other than testnet chain ID `968`.

## BOT Chain
- Mainnet: chain id 677, RPC https://rpc.botchain.ai, explorer https://scan.botchain.ai/
- Testnet: chain id 968, RPC https://rpc.bohr.life, explorer https://scan.bohr.life/
- Mainnet RPC disables `eth_getLogs`; keep a transaction receipt database and direct state-read layer.

## Branding
BOT Chain official logo (downloaded from the official brand kit) is used in footer, linked to https://www.botchain.ai/en/. Explorer linked to https://scan.botchain.ai/. "Built on BOT Chain" displayed.

## Quality notes
- Measured vs estimated vs independently verified energy attributes are distinguished throughout.
- Annual grid averages are never presented as hourly evidence.
- Raw meter streams and private credentials are never stored on-chain.
- No carbon-credit or token mechanism is created.

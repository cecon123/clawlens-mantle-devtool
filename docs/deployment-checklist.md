# Deployment Checklist

Use this checklist before submitting ClawLens to DoraHacks.

## Required Proof

- GitHub repo is public.
- Frontend is publicly accessible at `https://cecon123.github.io/clawlens-mantle-devtool/`.
- Demo video is at least 2 minutes.
- `npm test` passes.
- `npm run build` passes.
- `AgentAuditRegistry` is deployed on Mantle Sepolia or Mantle Mainnet.
- Contract address is visible in the app.
- Explorer link opens the deployed contract.
- At least one demo audit packet is recorded on-chain.
- README includes setup, architecture, deployed address, and demo flow.

## Mantle Deploy Steps

```bash
npm run wallet:balance
npm run contract:compile
npm run contract:deploy
npm run contract:record
npm run build
```

## Current Deploy Blocker

The current deploy wallet has 0 MNT:

```text
0xA627b3340398138694d5c857AC813bf7Ee30E365
```

Do not submit the project as deployed until this wallet is funded and the scripts write real files under `deployments/`.

## Faucet Notes

- HackQuest faucet requires HackQuest sign-in.
- The GitHub OAuth flow requests `read:repo`, so it should not be authorized without explicit user consent.
- QuickNode faucet is blocked by Cloudflare verification in automated browser mode.
- Mantle official faucet requires a wallet extension connection; no wallet extension is installed in CloakBrowser.

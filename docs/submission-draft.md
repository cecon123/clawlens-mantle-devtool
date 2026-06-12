# DoraHacks Submission Draft

## Project Name

ClawLens

## Tagline

Tamper-evident audit packets for Byreal and RealClaw-style DeFi agents on Mantle.

## Track

AI DevTools

## Short Description

ClawLens is an AI-agent audit console that converts DeFi agent plans into deterministic risk packets, scores risky autonomy before execution, and anchors the packet hash on Mantle Sepolia for judge-verifiable review.

## Long Description

AI agents can plan swaps, LP ranges, copy-farming actions, and wallet operations faster than users can inspect them. ClawLens adds a transparent pre-execution review layer for Byreal and RealClaw-style actions.

The app maps each agent plan to a capability, scores exposure and control risks, generates a canonical JSON audit packet, derives a keccak256 packet hash, and prepares the exact Mantle registry calldata. After deployment, the `AgentAuditRegistry` contract stores the packet hash, label, score, URI, reporter, and timestamp so judges can compare the UI, JSON packet, and explorer record.

The project is scoped as AI DevTools rather than an autonomous trading bot. It helps agent builders show what their agent intended to do before capital is moved.

## What Is Real

- React dashboard and plan switcher
- deterministic packet builder
- risk scoring logic
- keccak256 packet hash
- Solidity registry contract
- contract compile/deploy script
- sample packet generation
- unit tests

## What Is Pending

- Mantle Sepolia deployment, blocked until the deploy wallet receives testnet MNT
- demo record transaction, blocked until deployment
- hosted frontend URL is live on GitHub Pages

## Links To Fill

- GitHub: https://github.com/cecon123/clawlens-mantle-devtool
- Live demo: https://cecon123.github.io/clawlens-mantle-devtool/
- Demo video:
- Contract explorer:
- Demo audit transaction:

## Contact

- GitHub: cecon123
- Discord: cecon123
- Telegram: https://t.me/cecon123
- Email: mrcatcat1996@gmail.com

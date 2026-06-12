import { mkdir, writeFile } from 'node:fs/promises'
import { keccak256, toUtf8Bytes } from 'ethers'

const packet = {
  agentLabel: 'Copy-farm guardrail bot',
  autonomousActions: [
    'inspect top farmer profile',
    'simulate copied range',
    'block action if drawdown threshold is exceeded',
  ],
  capability: 'copyFarming',
  controls: ['Human approval before capital movement', 'Multiple external signals available for cross-checking'],
  flags: ['Token exposure above 500 USD', 'Slippage allowance should be reviewed', 'Multi-step autonomy requires monitoring'],
  objective: 'Copy a public farmer strategy only when risk constraints match the user policy.',
  riskScore: 60,
  schema: 'clawlens.audit.v1',
  source: 'Byreal Agent Skills',
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }
  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

const packetHash = keccak256(toUtf8Bytes(stableStringify(packet)))
await mkdir('sample-packets', { recursive: true })
await writeFile(
  'sample-packets/copy-farm-guardrail.json',
  JSON.stringify(
    {
      ...packet,
      packetHash,
    },
    null,
    2,
  ),
)

console.log(`Wrote sample packet ${packetHash}`)

import { AbiCoder, keccak256, toUtf8Bytes } from 'ethers'

export type CapabilityKey =
  | 'swapExecution'
  | 'poolAnalysis'
  | 'copyFarming'
  | 'positionManagement'
  | 'walletManagement'

export interface AgentPlan {
  agentLabel: string
  source: 'Byreal Agent Skills' | 'Byreal Perps Agent Skills' | 'RealClaw'
  capability: CapabilityKey
  objective: string
  autonomousActions: string[]
  tokenExposureUsd: number
  maxSlippageBps: number
  externalSignals: string[]
  requiresUserConfirmation: boolean
}

export interface AuditPacket {
  schema: 'clawlens.audit.v1'
  agentLabel: string
  source: AgentPlan['source']
  capability: CapabilityKey
  objective: string
  autonomousActions: string[]
  riskScore: number
  flags: string[]
  controls: string[]
  packetHash: string
}

const capabilityLabels: Record<CapabilityKey, string> = {
  copyFarming: 'Copy Farming',
  poolAnalysis: 'Pool Analysis',
  positionManagement: 'Position Management',
  swapExecution: 'Swap Execution',
  walletManagement: 'Wallet Management',
}

export const samplePlans: AgentPlan[] = [
  {
    agentLabel: 'RealClaw safe-yield scout',
    autonomousActions: ['rank stablecoin pools', 'prepare LP range', 'request user approval before capital movement'],
    capability: 'poolAnalysis',
    externalSignals: ['Byreal pool APR', 'pool TVL', 'range volatility'],
    maxSlippageBps: 35,
    objective: 'Find a low-risk USDC stable pool and produce a pre-trade evidence packet.',
    requiresUserConfirmation: true,
    source: 'Byreal Agent Skills',
    tokenExposureUsd: 120,
  },
  {
    agentLabel: 'Copy-farm guardrail bot',
    autonomousActions: ['inspect top farmer profile', 'simulate copied range', 'block action if drawdown threshold is exceeded'],
    capability: 'copyFarming',
    externalSignals: ['Real Farmer leaderboard', 'pool volatility', 'estimated daily fees'],
    maxSlippageBps: 80,
    objective: 'Copy a public farmer strategy only when risk constraints match the user policy.',
    requiresUserConfirmation: true,
    source: 'Byreal Agent Skills',
    tokenExposureUsd: 750,
  },
  {
    agentLabel: 'Autonomous swap assistant',
    autonomousActions: ['discover token route', 'quote swap', 'execute once policy is satisfied'],
    capability: 'swapExecution',
    externalSignals: ['Byreal route quote', 'Jupiter backup route', 'wallet balance'],
    maxSlippageBps: 145,
    objective: 'Swap USDC into a target asset when quoted impact and wallet policy permit execution.',
    requiresUserConfirmation: false,
    source: 'RealClaw',
    tokenExposureUsd: 450,
  },
]

export function capabilityName(key: CapabilityKey) {
  return capabilityLabels[key]
}

export function scorePlan(plan: AgentPlan) {
  const flags: string[] = []
  const controls: string[] = []
  let score = 14

  if (plan.tokenExposureUsd > 500) {
    score += 24
    flags.push('Token exposure above 500 USD')
  } else if (plan.tokenExposureUsd > 200) {
    score += 12
    flags.push('Moderate token exposure')
  } else {
    controls.push('Small notional exposure')
  }

  if (plan.maxSlippageBps > 100) {
    score += 22
    flags.push('Slippage allowance exceeds 1%')
  } else if (plan.maxSlippageBps > 50) {
    score += 12
    flags.push('Slippage allowance should be reviewed')
  } else {
    controls.push('Tight slippage bound')
  }

  if (!plan.requiresUserConfirmation) {
    score += 25
    flags.push('Execution can happen without user confirmation')
  } else {
    controls.push('Human approval before capital movement')
  }

  if (plan.autonomousActions.length > 2) {
    score += 10
    flags.push('Multi-step autonomy requires monitoring')
  }

  if (plan.externalSignals.length >= 3) {
    controls.push('Multiple external signals available for cross-checking')
  }

  return {
    controls,
    flags,
    riskScore: Math.min(100, score),
  }
}

export function buildAuditPacket(plan: AgentPlan): AuditPacket {
  const risk = scorePlan(plan)
  const packetWithoutHash = {
    autonomousActions: plan.autonomousActions,
    capability: plan.capability,
    controls: risk.controls,
    flags: risk.flags,
    objective: plan.objective,
    riskScore: risk.riskScore,
    schema: 'clawlens.audit.v1' as const,
    source: plan.source,
    agentLabel: plan.agentLabel,
  }
  const packetHash = hashPacket(packetWithoutHash)

  return {
    ...packetWithoutHash,
    packetHash,
  }
}

export function hashPacket(packet: Omit<AuditPacket, 'packetHash'>) {
  const canonical = stableStringify(packet)
  return keccak256(toUtf8Bytes(canonical))
}

export function registryCallPreview(packet: AuditPacket, uri: string) {
  const coder = AbiCoder.defaultAbiCoder()
  return coder.encode(['bytes32', 'string', 'uint8', 'string'], [
    packet.packetHash,
    packet.agentLabel,
    packet.riskScore,
    uri,
  ])
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
      left.localeCompare(right),
    )
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(',')}}`
  }

  return JSON.stringify(value)
}

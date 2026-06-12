import { describe, expect, it } from 'vitest'
import { buildAuditPacket, registryCallPreview, samplePlans } from './audit'

describe('ClawLens audit packets', () => {
  it('creates deterministic packet hashes', () => {
    const first = buildAuditPacket(samplePlans[0]!)
    const second = buildAuditPacket(samplePlans[0]!)

    expect(first.packetHash).toEqual(second.packetHash)
    expect(first.packetHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
  })

  it('scores uncontrolled execution higher than confirmed execution', () => {
    const guarded = buildAuditPacket(samplePlans[0]!)
    const autonomous = buildAuditPacket(samplePlans[2]!)

    expect(autonomous.riskScore).toBeGreaterThan(guarded.riskScore)
    expect(autonomous.flags).toContain('Execution can happen without user confirmation')
  })

  it('builds a contract call preview for Mantle anchoring', () => {
    const packet = buildAuditPacket(samplePlans[1]!)
    const preview = registryCallPreview(packet, 'ipfs://demo-packet')

    expect(preview).toMatch(/^0x/)
    expect(preview.length).toBeGreaterThan(200)
  })
})

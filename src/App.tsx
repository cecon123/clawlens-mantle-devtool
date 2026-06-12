import {
  Activity,
  Bot,
  Braces,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileJson,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  buildAuditPacket,
  capabilityName,
  registryCallPreview,
  samplePlans,
  type AgentPlan,
} from './lib/audit'
import { deployment } from './lib/deployment'
import heroImage from './assets/clawlens-hero.png'

const packetUri =
  'https://github.com/cecon123/clawlens-mantle-devtool/blob/main/sample-packets/copy-farm-guardrail.json'

export function App() {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const plan = samplePlans[selectedIndex] as AgentPlan
  const packet = useMemo(() => buildAuditPacket(plan), [plan])
  const calldata = useMemo(() => registryCallPreview(packet, packetUri), [packet])

  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand-mark">
          <Bot size={24} />
        </div>
        <button aria-label="Audit workspace" className="rail-button selected" type="button">
          <ShieldAlert size={18} />
        </button>
        <button aria-label="Packet JSON" className="rail-button" type="button">
          <FileJson size={18} />
        </button>
        <button aria-label="Mantle proof" className="rail-button" type="button">
          <Braces size={18} />
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>AI DevTools / Mantle Turing Test</p>
            <h1>ClawLens</h1>
          </div>
          <a className="github-link" href="https://github.com/byreal-git/byreal-agent-skills" target="_blank">
            Byreal Agent Skills
            <ExternalLink size={16} />
          </a>
        </header>

        <section className="hero-strip">
          <div className="hero-copy">
            <h2>Hash every risky DeFi agent plan before it touches capital.</h2>
            <p>
              ClawLens maps Byreal and RealClaw-style actions into deterministic audit packets,
              then anchors the packet hash on Mantle for judge-verifiable review.
            </p>
          </div>
          <div className="hero-media" aria-hidden="true">
            <img alt="" src={heroImage} />
          </div>
        </section>

        <section className="main-grid">
          <aside className="plan-panel">
            <p className="panel-label">Agent plan</p>
            <div className="plan-list">
              {samplePlans.map((item, index) => (
                <button
                  className={index === selectedIndex ? 'selected' : ''}
                  key={item.agentLabel}
                  onClick={() => setSelectedIndex(index)}
                  type="button"
                >
                  <span>{capabilityName(item.capability)}</span>
                  <strong>{item.agentLabel}</strong>
                  <small>{item.source}</small>
                </button>
              ))}
            </div>

            <section className="objective-box">
              <p className="panel-label">Objective</p>
              <strong>{plan.objective}</strong>
              <div className="stat-row">
                <span>Exposure</span>
                <b>${plan.tokenExposureUsd.toLocaleString()}</b>
              </div>
              <div className="stat-row">
                <span>Max slippage</span>
                <b>{plan.maxSlippageBps} bps</b>
              </div>
            </section>
          </aside>

          <section className="audit-panel">
            <div className="score-card">
              <div>
                <p className="panel-label">Risk score</p>
                <strong>{packet.riskScore}</strong>
                <span>/100</span>
              </div>
              <RiskMeter value={packet.riskScore} />
            </div>

            <div className="packet-grid">
              <section>
                <p className="panel-label">Flags</p>
                {packet.flags.map((flag) => (
                  <div className="line-item warn" key={flag}>
                    <ShieldAlert size={16} />
                    {flag}
                  </div>
                ))}
              </section>
              <section>
                <p className="panel-label">Controls</p>
                {packet.controls.map((control) => (
                  <div className="line-item ok" key={control}>
                    <CheckCircle2 size={16} />
                    {control}
                  </div>
                ))}
              </section>
            </div>

            <section className="json-box">
              <div>
                <p className="panel-label">Deterministic packet hash</p>
                <code>{packet.packetHash}</code>
              </div>
              <button
                aria-label="Copy packet hash"
                onClick={() => navigator.clipboard?.writeText(packet.packetHash)}
                type="button"
              >
                <Copy size={16} />
              </button>
            </section>
          </section>

          <aside className="proof-panel">
            <p className="panel-label">Mantle proof</p>
            <div className={`proof-status ${deployment.status}`}>
              <Activity size={18} />
              <span>
                <strong>{deployment.status === 'deployed' ? 'Registry deployed' : 'Deployment pending'}</strong>
                <small>{deployment.network}</small>
              </span>
            </div>

            <div className="proof-field">
              <span>Registry</span>
              <code>{deployment.address || 'Run npm run contract:deploy after funding wallet'}</code>
            </div>
            <div className="proof-field">
              <span>Calldata preview</span>
              <code>{`${calldata.slice(0, 58)}...${calldata.slice(-18)}`}</code>
            </div>
            <div className="proof-field">
              <span>Packet URI</span>
              <code>{packetUri}</code>
            </div>

            <a
              className={deployment.explorerUrl ? 'proof-link' : 'proof-link disabled'}
              href={deployment.explorerUrl || undefined}
              target="_blank"
            >
              Open Mantle explorer
              <ExternalLink size={16} />
            </a>
          </aside>
        </section>
      </section>
    </main>
  )
}

function RiskMeter({ value }: { value: number }) {
  const bars = [12, 28, 44, 61, 75, 88]
  return (
    <div className="risk-meter" aria-label={`Risk score ${value}`}>
      {bars.map((bar) => (
        <i className={value >= bar ? 'active' : ''} key={bar} />
      ))}
      <Sparkles size={20} />
    </div>
  )
}

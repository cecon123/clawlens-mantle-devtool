import { readFile, writeFile } from 'node:fs/promises'
import { Contract, JsonRpcProvider } from 'ethers'
import { artifactPath, deploymentPath, mantleSepolia } from './constants.mjs'
import { loadWallet } from './wallet.mjs'

const artifact = JSON.parse(await readFile(artifactPath, 'utf8'))
const deployment = JSON.parse(await readFile(deploymentPath, 'utf8'))
const packet = JSON.parse(await readFile('sample-packets/copy-farm-guardrail.json', 'utf8'))
const provider = new JsonRpcProvider(mantleSepolia.rpcUrl, mantleSepolia.chainId)
const wallet = (await loadWallet()).connect(provider)
const registry = new Contract(deployment.address, artifact.abi, wallet)

const packetURI =
  'https://github.com/cecon123/clawlens-mantle-devtool/blob/main/sample-packets/copy-farm-guardrail.json'
const tx = await registry.recordAudit(packet.packetHash, packet.agentLabel, packet.riskScore, packetURI)
const receipt = await tx.wait()

const proof = {
  packetHash: packet.packetHash,
  packetURI,
  recordTx: receipt.hash,
  recordUrl: `${mantleSepolia.explorer}/tx/${receipt.hash}`,
  recordedAt: new Date().toISOString(),
}

await writeFile('deployments/demo-record.json', JSON.stringify(proof, null, 2))
console.log(`Recorded audit packet: ${receipt.hash}`)
console.log(proof.recordUrl)

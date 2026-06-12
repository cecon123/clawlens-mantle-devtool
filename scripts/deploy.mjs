import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { ContractFactory, formatEther, JsonRpcProvider } from 'ethers'
import { artifactPath, deploymentPath, mantleSepolia } from './constants.mjs'
import { loadWallet } from './wallet.mjs'

const artifact = JSON.parse(await readFile(artifactPath, 'utf8'))
const provider = new JsonRpcProvider(mantleSepolia.rpcUrl, mantleSepolia.chainId)
const wallet = (await loadWallet()).connect(provider)
const balance = await provider.getBalance(wallet.address)

console.log(`Deploying from ${wallet.address}`)
console.log(`Balance: ${formatEther(balance)} MNT`)

if (balance === 0n) {
  throw new Error('Wallet has 0 MNT. Fund it with Mantle Sepolia testnet MNT before deployment.')
}

const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet)
const contract = await factory.deploy()
const deployment = await contract.deploymentTransaction().wait()
const address = await contract.getAddress()

await mkdir('deployments', { recursive: true })
await writeFile(
  deploymentPath,
  JSON.stringify(
    {
      address,
      chainId: mantleSepolia.chainId,
      explorerUrl: `${mantleSepolia.explorer}/address/${address}`,
      network: mantleSepolia.name,
      rpcUrl: mantleSepolia.rpcUrl,
      txHash: deployment.hash,
      deployedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
)

await writeFile(
  'src/lib/deployment.ts',
  `export const deployment = {
  address: '${address}',
  explorerUrl: '${mantleSepolia.explorer}/address/${address}',
  network: '${mantleSepolia.name}',
  status: 'deployed' as 'pending' | 'deployed',
}
`,
)

console.log(`Deployed AgentAuditRegistry: ${address}`)
console.log(`Explorer: ${mantleSepolia.explorer}/address/${address}`)

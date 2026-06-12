import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { Wallet } from 'ethers'
import { localWalletPath } from './constants.mjs'

if (existsSync(localWalletPath)) {
  console.log('Local wallet already exists. Refusing to overwrite .local/wallet.json.')
  process.exit(0)
}

const wallet = Wallet.createRandom()
await mkdir('.local', { recursive: true })
await writeFile(
  localWalletPath,
  JSON.stringify(
    {
      address: wallet.address,
      privateKey: wallet.privateKey,
      warning: 'Testnet-only wallet generated for ClawLens deployment. Do not commit this file.',
    },
    null,
    2,
  ),
  { mode: 0o600 },
)

console.log(`Created testnet wallet: ${wallet.address}`)
console.log('Private key saved locally in .local/wallet.json and is ignored by git.')

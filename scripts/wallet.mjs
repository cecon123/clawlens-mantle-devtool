import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { Wallet } from 'ethers'
import { localWalletPath } from './constants.mjs'

export async function loadWallet() {
  const privateKey = process.env.PRIVATE_KEY || (await readLocalPrivateKey())
  if (!privateKey) {
    throw new Error('Missing wallet. Run npm run wallet:new or set PRIVATE_KEY.')
  }
  return new Wallet(privateKey)
}

async function readLocalPrivateKey() {
  if (!existsSync(localWalletPath)) return undefined
  const raw = await readFile(localWalletPath, 'utf8')
  return JSON.parse(raw).privateKey
}

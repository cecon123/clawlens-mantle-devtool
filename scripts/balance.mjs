import { formatEther, JsonRpcProvider } from 'ethers'
import { mantleSepolia } from './constants.mjs'
import { loadWallet } from './wallet.mjs'

const provider = new JsonRpcProvider(mantleSepolia.rpcUrl, mantleSepolia.chainId)
const wallet = (await loadWallet()).connect(provider)
const balance = await provider.getBalance(wallet.address)

console.log(`Network: ${mantleSepolia.name}`)
console.log(`Address: ${wallet.address}`)
console.log(`Balance: ${formatEther(balance)} MNT`)

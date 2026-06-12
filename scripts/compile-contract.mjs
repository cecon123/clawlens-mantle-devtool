import { mkdir, readFile, writeFile } from 'node:fs/promises'
import solc from 'solc'
import { artifactPath } from './constants.mjs'

const sourcePath = 'contracts/AgentAuditRegistry.sol'
const source = await readFile(sourcePath, 'utf8')
const input = {
  language: 'Solidity',
  sources: {
    [sourcePath]: {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object', 'metadata'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))
const errors = output.errors?.filter((item) => item.severity === 'error') || []

if (errors.length) {
  for (const error of errors) console.error(error.formattedMessage)
  process.exit(1)
}

const contract = output.contracts[sourcePath].AgentAuditRegistry
await mkdir('artifacts', { recursive: true })
await writeFile(
  artifactPath,
  JSON.stringify(
    {
      abi: contract.abi,
      bytecode: `0x${contract.evm.bytecode.object}`,
      compiler: solc.version(),
      contractName: 'AgentAuditRegistry',
      sourcePath,
    },
    null,
    2,
  ),
)

console.log(`Compiled AgentAuditRegistry -> ${artifactPath}`)

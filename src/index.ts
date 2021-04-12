#!/usr/bin/env ts-node

import { program } from 'commander'
import getPackageJson from './utils/package-json'
import { upsert } from './commands/upsert'

const packageJson = getPackageJson()

program
  .version(packageJson.version || '0.0.0-development')
  .description(packageJson.description || 'Evaporate')
  .arguments('COMMAND')
  .option('-V, --verbose')
  .option('-R, --defualt-region <REGION>', 'AWS Region')

program
  .option('-s, --stack-name <STACK_NAME>', 'Stack Name')
  .option('-d, --dry-run')
  .option('-f, --on-create-fail <FAUILURE_BEHAVIOUR>', 'Failure Behaviour')

program.parse(process.argv)

function main(): void {
  console.log(program.args)
}

function areWeTestingWithJest(): boolean {
  return process.env.JEST_WORKER_ID !== undefined
}

areWeTestingWithJest() ? main() : null // eslint-disable-line

export { main, areWeTestingWithJest, upsert }
